const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const ROLES = require('../constants/roles');

const { BASE_URL } = require('../config/env');

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const formatUser = (user) => {
  const obj = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    rollNo: user.rollNo,
    departmentId: user.departmentId,
    phone: user.phone,
    alternateEmail: user.alternateEmail,
    gender: user.gender,
    profileImage: user.profileImage
      ? (user.profileImage.startsWith('http') ? user.profileImage : `${BASE_URL}${user.profileImage}`)
      : null,
    semester: user.semester,
    grNo: user.grNo,
    dob: user.dob,
  };
  return obj;
};

const register = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });

  if (!user) {
    const err = new Error('Student not added by faculty');
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
  return { user: formatUser(user), token };
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
  return { user: formatUser(user), token };
};

module.exports = { register, login };
