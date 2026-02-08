const { error } = require('../utils/apiResponse');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Authentication required.', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return error(res, 'Access denied. Insufficient permissions.', 403);
    }

    next();
  };
};

module.exports = authorize;
