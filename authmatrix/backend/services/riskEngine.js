// Rule-based risk evaluation engine for AuthMatrix.
// Calculates a risk score (0–100) and risk level with explanation based on several factors.

const getRiskLevel = (score) => {
  if (score < 30) return 'Low';
  if (score < 70) return 'Medium';
  return 'High';
};

/**
 * Evaluates risk based on contextual factors.
 *
 * @param {Object} params
 * @param {import('../models/User').User} params.user
 * @param {string} params.ipAddress
 * @param {boolean} params.isFailedLogin
 * @param {boolean} params.isAdminAction
 * @param {number} params.recentFailedLoginsLastHour
 * @param {number} params.recentRequestsLastMinute
 * @param {Date} [params.timestamp]
 */
const evaluateRisk = ({
  user,
  ipAddress,
  isFailedLogin,
  isAdminAction,
  recentFailedLoginsLastHour,
  recentRequestsLastMinute,
  timestamp = new Date(),
}) => {
  let score = 0;
  const reasons = [];

  // Multiple failed logins
  if (recentFailedLoginsLastHour >= 3) {
    score += 25;
    reasons.push(`Multiple failed logins detected in the last hour (${recentFailedLoginsLastHour})`);
  }

  if (isFailedLogin) {
    score += 15;
    reasons.push('Current attempt is a failed login');
  }

  // New IP address
  if (user && user.lastLoginIP && user.lastLoginIP !== ipAddress) {
    score += 20;
    reasons.push(`New IP address detected (previous: ${user.lastLoginIP}, current: ${ipAddress})`);
  }

  // Unusual login time (night hours 00:00–05:00)
  const hour = timestamp.getUTCHours();
  if (hour >= 0 && hour <= 5) {
    score += 15;
    reasons.push('Unusual login time (night hours)');
  }

  // Rapid API requests
  if (recentRequestsLastMinute >= 30) {
    score += 25;
    reasons.push(`High volume of requests in the last minute (${recentRequestsLastMinute})`);
  } else if (recentRequestsLastMinute >= 10) {
    score += 10;
    reasons.push(`Elevated request volume in the last minute (${recentRequestsLastMinute})`);
  }

  // Admin account suspicious activity
  if (isAdminAction && (isFailedLogin || recentRequestsLastMinute >= 10)) {
    score += 20;
    reasons.push('Suspicious activity on an admin account');
  }

  // Clamp score
  if (score > 100) score = 100;

  const riskLevel = getRiskLevel(score);
  const explanation = reasons.length ? reasons.join('; ') : 'No significant risk factors detected';

  return {
    riskScore: score,
    riskLevel,
    explanation,
  };
};

module.exports = {
  evaluateRisk,
};

