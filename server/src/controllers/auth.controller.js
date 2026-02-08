const authService = require('../services/auth.service');
const { success, error } = require('../utils/apiResponse');

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    return success(res, result, 'Registration successful', 201);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return success(res, result, 'Login successful');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

module.exports = { register, login };
