const certificateService = require('../services/certificate.service');
const { success, error } = require('../utils/apiResponse');

const create = async (req, res) => {
  try {
    const result = await certificateService.create(req.user._id, req.body, req.file);
    return success(res, result, 'Certificate uploaded successfully', 201);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getMyCertificates = async (req, res) => {
  try {
    const result = await certificateService.getByStudent(req.user._id);
    return success(res, result, 'Certificates retrieved successfully');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getPending = async (req, res) => {
  try {
    const result = await certificateService.getPending(req.user.departmentId);
    return success(res, result, 'Pending certificates retrieved successfully');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getAll = async (req, res) => {
  try {
    const result = await certificateService.getAll(req.user.departmentId);
    return success(res, result, 'All certificates retrieved successfully');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const getById = async (req, res) => {
  try {
    const result = await certificateService.getById(req.params.id);
    return success(res, result, 'Certificate retrieved successfully');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const update = async (req, res) => {
  try {
    const result = await certificateService.update(req.params.id, req.user._id, req.body);
    return success(res, result, 'Certificate updated successfully');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const remove = async (req, res) => {
  try {
    const result = await certificateService.remove(req.params.id, req.user._id);
    return success(res, result, 'Certificate deleted successfully');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

const verify = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const result = await certificateService.verify(req.params.id, req.user._id, status, remarks);
    return success(res, result, `Certificate ${status.toLowerCase()} successfully`);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
};

module.exports = { create, getMyCertificates, getPending, getAll, getById, update, remove, verify };
