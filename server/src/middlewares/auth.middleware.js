const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const User = require('../models/user.model');
const { error } = require('../utils/apiResponse');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) {
      return error(res, 'User not found.', 401);
    }

    if (!user.isActive) {
      return error(res, 'Account is deactivated.', 403);
    }

    req.user = user;
    next();
  } catch (err) {
    return error(res, 'Invalid token.', 401);
  }
};

module.exports = authenticate;
