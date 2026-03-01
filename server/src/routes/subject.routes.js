const express = require('express');
const router = express.Router();
const Subject = require('../models/subject.model');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate');
const { success, error } = require('../utils/apiResponse');
const ROLES = require('../constants/roles');
const { createSubjectSchema } = require('../validations/subject.validation');

router.use(authenticate);

router.post('/', authorize(ROLES.FACULTY), validate({ body: createSubjectSchema }), async (req, res) => {
  try {
    const { name, subjectCode, departmentId } = req.body;
    const subject = new Subject({ name, subjectCode, departmentId });
    await subject.save();
    return success(res, subject, 'Subject created successfully', 201);
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
});

router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate('departmentId', 'name')
      .sort({ name: 1 });
    return success(res, subjects, 'Subjects retrieved successfully');
  } catch (err) {
    return error(res, err.message, err.status || 500);
  }
});

module.exports = router;
