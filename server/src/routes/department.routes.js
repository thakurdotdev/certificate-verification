const express = require('express');
const router = express.Router();
const Department = require('../models/department.model');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate');
const { success, error } = require('../utils/apiResponse');
const ROLES = require('../constants/roles');
const { createDepartmentSchema } = require('../validations/department.validation');

router.use(authenticate);

router.post('/', authorize(ROLES.FACULTY), validate({ body: createDepartmentSchema }), async (req, res) => {
  try {
    const { name } = req.body;
    const department = new Department({ name });
    await department.save();
    return success(res, department, 'Department created successfully', 201);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
});

router.get('/', async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    return success(res, departments, 'Departments retrieved successfully');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
});

module.exports = router;
