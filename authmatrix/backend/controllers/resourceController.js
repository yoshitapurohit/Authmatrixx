const { createLog, countRecentRequests } = require('../services/logService');
const { evaluateRisk } = require('../services/riskEngine');
const { User, USER_ROLES } = require('../models/User');
const { RiskAlert } = require('../models/RiskAlert');

// Example protected resource access endpoint for both Admin and User roles
const accessProtectedResource = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const ipAddress = req.ip;

    const recentRequests = await countRecentRequests(
      userId,
      new Date(Date.now() - 60 * 1000)
    );

    const user = await User.findById(userId);

    const risk = evaluateRisk({
      user,
      ipAddress,
      isFailedLogin: false,
      isAdminAction: user.role === USER_ROLES.ADMIN,
      recentFailedLoginsLastHour: 0,
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
        userId,
        role: user.role,
        action: 'ACCESS_PROTECTED_RESOURCE',
        ipAddress,
        status: 'failure',
      });

      return res.status(403).json({
        message:
          'Request flagged as high risk. Your account has been temporarily blocked pending review.',
      });
    }

    await createLog({
      userId,
      role: user.role,
      action: 'ACCESS_PROTECTED_RESOURCE',
      ipAddress,
      status: 'success',
    });

    res.json({
      message: 'You have accessed a protected resource.',
      risk,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  accessProtectedResource,
};

