const userService = require('../services/user.service');
const { success, error } = require('../utils/apiResponse');

const createUser = async (req, res) => {
  try {
    const result = await userService.createUser(req.body);
    return success(res, result, 'User created successfully', 201);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const updateUser = async (req, res) => {
  try {
    const result = await userService.updateUser(req.params.id, req.body);
    return success(res, result, 'User updated successfully');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getAllStudents = async (req, res) => {
  try {
    const result = await userService.getAllStudents();
    return success(res, result, 'Students retrieved successfully');
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

module.exports = { createUser, updateUser, getAllStudents, getUserById };
