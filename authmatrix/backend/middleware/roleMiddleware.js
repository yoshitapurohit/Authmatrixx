const { USER_ROLES } = require('../models/User');

// Enforces role-based access control
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }

    next();
  };
};

module.exports = {
  authorizeRoles,
  USER_ROLES,
};

