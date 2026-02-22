const userService = require('../services/user.service');
const { success, error } = require('../utils/apiResponse');

const createUser = async (req, res) => {
  try {
    const result = await userService.createUser(req.body, req.file);
    return success(res, result, 'User created successfully', 201);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const updateUser = async (req, res) => {
  try {
    const result = await userService.updateUser(req.params.id, req.body, req.file);
    return success(res, result, 'User updated successfully');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getAllStudents = async (req, res) => {
  try {
    const result = await userService.getAllStudents(req.query.departmentId);
    return success(res, result, 'Students retrieved successfully');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getAllFaculty = async (req, res) => {
  try {
    const result = await userService.getAllFaculty();
    return success(res, result, 'Faculty retrieved successfully');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getUserById = async (req, res) => {
  try {
    const result = await userService.getUserById(req.params.id);
    return success(res, result, 'User retrieved successfully');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getProfile = async (req, res) => {
  try {
    const result = await userService.getProfile(req.user._id);
    return success(res, result, 'Profile retrieved successfully');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const updateProfile = async (req, res) => {
  try {
    const result = await userService.updateProfile(req.user._id, req.body, req.file);
    return success(res, result, 'Profile updated successfully');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

module.exports = { createUser, updateUser, getAllStudents, getAllFaculty, getUserById, getProfile, updateProfile };
