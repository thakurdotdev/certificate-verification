const User = require('../models/user.model');
const ROLES = require('../constants/roles');

const createUser = async (data) => {
  const { name, email, password, role, rollNo, departmentId } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }

  const userData = {
    name,
    email,
    role: role || ROLES.STUDENT,
    rollNo,
    departmentId,
  };

  if (role && role !== ROLES.STUDENT && password) {
    userData.passwordHash = password;
  }

  const user = new User(userData);
  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    rollNo: user.rollNo,
    departmentId: user.departmentId,
    isActive: user.isActive,
    isRegistered: !!user.passwordHash,
  };
};

const updateUser = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  const { name, departmentId, isActive, role } = data;

  if (name) user.name = name;
  if (departmentId) user.departmentId = departmentId;
  if (typeof isActive === 'boolean') user.isActive = isActive;
  if (role && Object.values(ROLES).includes(role)) user.role = role;

  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    rollNo: user.rollNo,
    departmentId: user.departmentId,
    isActive: user.isActive,
  };
};

const getAllStudents = async (departmentId) => {
  const filter = { role: ROLES.STUDENT };
  if (departmentId) filter.departmentId = departmentId;
  const students = await User.find(filter)
    .select('-passwordHash')
    .populate('departmentId', 'name')
    .sort({ createdAt: -1 });
  return students;
};

const getAllFaculty = async () => {
  const faculty = await User.find({ role: ROLES.FACULTY })
    .select('-passwordHash')
    .populate('departmentId', 'name')
    .sort({ createdAt: -1 });
  return faculty;
};

const getUserById = async (userId) => {
  const user = await User.findById(userId)
    .select('-passwordHash')
    .populate('departmentId', 'name');
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  return user;
};

module.exports = { createUser, updateUser, getAllStudents, getAllFaculty, getUserById };
