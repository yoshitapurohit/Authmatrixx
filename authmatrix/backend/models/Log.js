const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    role: {
      type: String,
      default: 'Unknown',
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['success', 'failure'],
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

const Log = mongoose.model('Log', logSchema);

module.exports = { Log };

