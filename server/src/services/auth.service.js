const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const ROLES = require('../constants/roles');

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const register = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  
  if (!user) {
    const err = new Error('Student not added by admin');
    err.status = 404;
    throw err;
  }

  if (user.role !== ROLES.STUDENT) {
    const err = new Error('Only students can register');
    err.status = 403;
    throw err;
  }

  if (user.passwordHash) {
    const err = new Error('Student already registered');
    err.status = 409;
    throw err;
  }

  user.passwordHash = password;
  await user.save();

  const token = generateToken(user._id);
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      department: user.department,
    },
    token,
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  if (!user.passwordHash) {
    const err = new Error('Account not activated. Please register first.');
    err.status = 403;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  if (!user.isActive) {
    const err = new Error('Account is deactivated');
    err.status = 403;
    throw err;
  }

  const token = generateToken(user._id);
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
      department: user.department,
    },
    token,
  };
};

module.exports = { register, login };
