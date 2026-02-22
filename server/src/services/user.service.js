const User = require('../models/user.model');
const ROLES = require('../constants/roles');
const { BASE_URL } = require('../config/env');

const addProfileImageUrl = (user) => {
  const obj = user.toObject ? user.toObject() : { ...user };
  if (obj.profileImage && !obj.profileImage.startsWith('http')) {
    obj.profileImage = `${BASE_URL}${obj.profileImage}`;
  }
  return obj;
};

const createUser = async (data, file) => {
  const { name, email, password, role, rollNo, departmentId, semester, grNo, phone, gender, dob } = data;

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
    semester,
    grNo,
    phone,
    gender,
    dob,
  };

  if (file) {
    userData.profileImage = `/uploads/${file.filename}`;
  }

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

const updateUser = async (userId, data, file) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  const allowedFields = ['name', 'departmentId', 'isActive', 'role', 'phone', 'alternateEmail', 'gender', 'semester', 'grNo', 'dob', 'rollNo'];
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      if (field === 'isActive') {
        const val = data[field];
        if (val === 'true' || val === true) user.isActive = true;
        else if (val === 'false' || val === false) user.isActive = false;
      } else if (field === 'role') {
        if (Object.values(ROLES).includes(data[field])) user[field] = data[field];
      } else {
        user[field] = data[field];
      }
    }
  }

  if (file) {
    user.profileImage = `/uploads/${file.filename}`;
  }

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

const getProfile = async (userId) => {
  const user = await User.findById(userId)
    .select('-passwordHash')
    .populate('departmentId', 'name');
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  return addProfileImageUrl(user);
};

const updateProfile = async (userId, data, file) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }

  const sharedFields = ['phone', 'alternateEmail', 'gender', 'name'];
  const studentFields = ['dob'];
  const allowed = user.role === ROLES.STUDENT
    ? [...sharedFields, ...studentFields]
    : sharedFields;

  for (const field of allowed) {
    if (data[field] !== undefined) {
      user[field] = data[field] || null;
    }
  }

  if (file) {
    user.profileImage = `/uploads/${file.filename}`;
  }

  await user.save();

  const updated = await User.findById(userId)
    .select('-passwordHash')
    .populate('departmentId', 'name');
  return addProfileImageUrl(updated);
};

const getAllStudents = async (departmentId) => {
  const filter = { role: ROLES.STUDENT };
  if (departmentId) filter.departmentId = departmentId;
  const students = await User.find(filter)
    .select('-passwordHash')
    .populate('departmentId', 'name')
    .sort({ createdAt: -1 });
  return students.map(addProfileImageUrl);
};

const getAllFaculty = async () => {
  const faculty = await User.find({ role: ROLES.FACULTY })
    .select('-passwordHash')
    .populate('departmentId', 'name')
    .sort({ createdAt: -1 });
  return faculty.map(addProfileImageUrl);
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
  return addProfileImageUrl(user);
};

module.exports = { createUser, updateUser, getProfile, updateProfile, getAllStudents, getAllFaculty, getUserById };
