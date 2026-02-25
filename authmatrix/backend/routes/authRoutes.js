const express = require('express');
const {
  register,
  login,
  getProfile,
  requestPasswordReset,
  resetPassword,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.get('/me', authenticate, getProfile);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;

