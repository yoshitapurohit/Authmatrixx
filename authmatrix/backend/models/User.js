const mongoose = require('mongoose');

const USER_ROLES = {
  ADMIN: 'Admin',
  USER: 'User',
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    failedAttempts: {
      type: Number,
      default: 0,
    },
    lastLoginIP: {
      type: String,
      default: null,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  }
);

userSchema.methods.isAccountLocked = function () {
  if (!this.lockUntil) return false;
  return this.lockUntil > new Date();
};

module.exports = {
  User: mongoose.model('User', userSchema),
  USER_ROLES,
};

