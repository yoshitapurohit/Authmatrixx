const express = require('express');
const {
  getUsers,
  updateUserRole,
  setUserBlockStatus,
  getLogs,
  getRiskAlerts,
  resolveRiskAlert,
} = require('../controllers/adminController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles, USER_ROLES } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authenticate, authorizeRoles(USER_ROLES.ADMIN));

router.get('/users', getUsers);
router.patch('/users/:userId/role', updateUserRole);
router.patch('/users/:userId/block', setUserBlockStatus);

router.get('/logs', getLogs);

router.get('/alerts', getRiskAlerts);
router.patch('/alerts/:alertId/resolve', resolveRiskAlert);

module.exports = router;

