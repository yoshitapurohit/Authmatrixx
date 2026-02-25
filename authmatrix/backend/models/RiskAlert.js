const mongoose = require('mongoose');

const riskAlertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    riskLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: false,
  }
);

const RiskAlert = mongoose.model('RiskAlert', riskAlertSchema);

module.exports = { RiskAlert };

