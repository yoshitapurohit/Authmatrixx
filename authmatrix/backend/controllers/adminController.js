const { User, USER_ROLES } = require('../models/User');
const { Log } = require('../models/Log');
const { RiskAlert } = require('../models/RiskAlert');
const { createLog } = require('../services/logService');

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Change user role
const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!Object.values(USER_ROLES).includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    await createLog({
      userId: req.user.id,
      role: req.user.role,
      action: `ADMIN_CHANGE_ROLE:${user._id}:${role}`,
      ipAddress: req.ip,
      status: 'success',
    });

    res.json({ message: 'User role updated successfully' });
  } catch (err) {
    next(err);
  }
};

// Block or unblock user
const setUserBlockStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBlocked = !!isBlocked;
    if (!isBlocked) {
      user.lockUntil = null;
      user.failedAttempts = 0;
    }
    await user.save();

    await createLog({
      userId: req.user.id,
      role: req.user.role,
      action: `ADMIN_${isBlocked ? 'BLOCK' : 'UNBLOCK'}_USER:${user._id}`,
      ipAddress: req.ip,
      status: 'success',
    });

    res.json({ message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully` });
  } catch (err) {
    next(err);
  }
};

// Get activity logs
const getLogs = async (req, res, next) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(500);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

// Get risk alerts
const getRiskAlerts = async (req, res, next) => {
  try {
    const alerts = await RiskAlert.find().sort({ timestamp: -1 }).limit(200).populate('userId', [
      'name',
      'email',
      'role',
    ]);
    res.json(alerts);
  } catch (err) {
    next(err);
  }
};

// Resolve a risk alert
const resolveRiskAlert = async (req, res, next) => {
  try {
    const { alertId } = req.params;

    const alert = await RiskAlert.findById(alertId);
    if (!alert) {
      return res.status(404).json({ message: 'Risk alert not found' });
    }

    alert.resolved = true;
    await alert.save();

    await createLog({
      userId: req.user.id,
      role: req.user.role,
      action: `ADMIN_RESOLVE_ALERT:${alertId}`,
      ipAddress: req.ip,
      status: 'success',
    });

    res.json({ message: 'Risk alert resolved' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  setUserBlockStatus,
  getLogs,
  getRiskAlerts,
  resolveRiskAlert,
};

