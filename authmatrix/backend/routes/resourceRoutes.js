const express = require('express');
const { accessProtectedResource } = require('../controllers/resourceController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles, USER_ROLES } = require('../middleware/roleMiddleware');

const router = express.Router();

// Both Admin and User roles can access resources
router.get(
  '/',
  authenticate,
  authorizeRoles(USER_ROLES.ADMIN, USER_ROLES.USER),
  accessProtectedResource
);

module.exports = router;

