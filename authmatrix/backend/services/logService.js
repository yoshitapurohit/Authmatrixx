const { Log } = require('../models/Log');

// Central helper for creating audit logs
const createLog = async ({ userId, role, action, ipAddress, status }) => {
  try {
    await Log.create({
      userId: userId || undefined,
      role: role || 'Unknown',
      action,
      ipAddress: ipAddress || null,
      status,
      timestamp: new Date(),
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to create log entry', err);
  }
};

const countRecentFailedLogins = async (userId, since) => {
  if (!userId) return 0;
  return Log.countDocuments({
    userId,
    status: 'failure',
    action: /login/i,
    timestamp: { $gte: since },
  });
};

const countRecentRequests = async (userId, since) => {
  if (!userId) return 0;
  return Log.countDocuments({
    userId,
    timestamp: { $gte: since },
  });
};

module.exports = {
  createLog,
  countRecentFailedLogins,
  countRecentRequests,
};

