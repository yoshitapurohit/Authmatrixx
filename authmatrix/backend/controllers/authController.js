const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { User, USER_ROLES } = require('../models/User');
const { RiskAlert } = require('../models/RiskAlert');
const { generateToken } = require('../utils/token');
const {
  createLog,
  countRecentFailedLogins,
  countRecentRequests,
} = require('../services/logService');
const { evaluateRisk } = require('../services/riskEngine');

const SALT_ROUNDS = 10;
const LOCK_DURATION_MINUTES = 15;

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role === USER_ROLES.ADMIN ? USER_ROLES.ADMIN : USER_ROLES.USER,
    });

    await createLog({
      userId: user._id,
      role: user.role,
      action: 'REGISTER',
      ipAddress: req.ip,
      status: 'success',
    });

    res.status(201).json({
      message: 'User registered successfully',
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      await createLog({
        action: 'LOGIN',
        status: 'failure',
        ipAddress,
      });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.isBlocked) {
      await createLog({
        userId: user._id,
        role: user.role,
        action: 'LOGIN',
        ipAddress,
        status: 'failure',
      });
      return res
        .status(403)
        .json({ message: 'Account is blocked. Please contact an administrator.' });
    }

    if (user.isAccountLocked()) {
      await createLog({
        userId: user._id,
        role: user.role,
        action: 'LOGIN',
        ipAddress,
        status: 'failure',
      });
      return res.status(403).json({
        message: 'Account temporarily locked due to multiple failed attempts. Try again later.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    const recentFailed = await countRecentFailedLogins(
      user._id,
      new Date(Date.now() - 60 * 60 * 1000)
    );
    const recentRequests = await countRecentRequests(
      user._id,
      new Date(Date.now() - 60 * 1000)
    );

    if (!isMatch) {
      user.failedAttempts += 1;

      if (user.failedAttempts >= 3) {
        user.lockUntil = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);
      }

      await user.save();

      const risk = evaluateRisk({
        user,
        ipAddress,
        isFailedLogin: true,
        isAdminAction: user.role === USER_ROLES.ADMIN,
        recentFailedLoginsLastHour: recentFailed + 1,
        recentRequestsLastMinute: recentRequests,
      });

      if (risk.riskLevel === 'High') {
        user.isBlocked = true;
        await user.save();

        await RiskAlert.create({
          userId: user._id,
          riskScore: risk.riskScore,
          riskLevel: risk.riskLevel,
          reason: risk.explanation,
        });
      }

      await createLog({
        userId: user._id,
        role: user.role,
        action: 'LOGIN',
        ipAddress,
        status: 'failure',
      });

      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Successful login: reset failed attempts and lock
    user.failedAttempts = 0;
    user.lockUntil = null;

    const previousIP = user.lastLoginIP;
    user.lastLoginIP = ipAddress;

    const risk = evaluateRisk({
      user,
      ipAddress,
      isFailedLogin: false,
      isAdminAction: user.role === USER_ROLES.ADMIN,
      recentFailedLoginsLastHour: recentFailed,
      recentRequestsLastMinute: recentRequests,
    });

    if (risk.riskLevel === 'High') {
      user.isBlocked = true;
      await user.save();

      await RiskAlert.create({
        userId: user._id,
        riskScore: risk.riskScore,
        riskLevel: risk.riskLevel,
        reason: risk.explanation,
      });

      await createLog({
        userId: user._id,
        role: user.role,
        action: 'LOGIN',
        ipAddress,
        status: 'failure',
      });

      return res.status(403).json({
        message:
          'Login flagged as high risk. Your account has been temporarily blocked pending review.',
      });
    }

    await user.save();

    await createLog({
      userId: user._id,
      role: user.role,
      action: 'LOGIN',
      ipAddress,
      status: 'success',
    });

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLoginIP: previousIP,
      },
      risk: {
        riskScore: risk.riskScore,
        riskLevel: risk.riskLevel,
        explanation: risk.explanation,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      // Do not leak whether the email exists
      return res.json({
        message:
          'If an account exists for this email, a password reset link has been generated.',
      });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();

    await createLog({
      userId: user._id,
      role: user.role,
      action: 'REQUEST_PASSWORD_RESET',
      ipAddress: req.ip,
      status: 'success',
    });

    // In a real system we'd email this link; for hackathon/demo we return the token.
    res.json({
      message:
        'If an account exists for this email, a password reset link has been generated.',
      resetToken: rawToken,
    });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters long' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Password reset token is invalid or has expired',
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.failedAttempts = 0;
    user.lockUntil = null;
    user.isBlocked = false;

    await user.save();

    await createLog({
      userId: user._id,
      role: user.role,
      action: 'RESET_PASSWORD',
      ipAddress: req.ip,
      status: 'success',
    });

    res.json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  requestPasswordReset,
  resetPassword,
};

