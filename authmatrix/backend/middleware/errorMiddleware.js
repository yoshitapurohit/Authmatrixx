// Centralized error handling middleware
// Ensures consistent error responses and avoids leaking internal details.

// 404 handler
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: 'Route not found',
  });
};

// Generic error handler
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 ? 'Internal server error' : err.message || 'Request failed';

  res.status(statusCode).json({
    message,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};

