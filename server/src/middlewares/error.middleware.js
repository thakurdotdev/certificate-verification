const { error } = require('../utils/apiResponse');

const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return error(res, 'Validation failed', 400, messages);
  }

  if (err.name === 'CastError') {
    return error(res, 'Invalid ID format', 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return error(res, `${field} already exists`, 409);
  }

  if (err.name === 'MulterError') {
    return error(res, err.message, 400);
  }

  return error(res, err.message || 'Internal server error', err.status || 500);
};

module.exports = errorMiddleware;
