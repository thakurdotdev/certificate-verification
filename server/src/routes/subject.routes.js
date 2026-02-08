const express = require('express');
const router = express.Router();
const Subject = require('../models/subject.model');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const { success } = require('../utils/apiResponse');
const ROLES = require('../constants/roles');

router.use(authenticate);

router.post('/', authorize(ROLES.ADMIN), async (req, res, next) => {
  try {
    const { name, subjectCode, department } = req.body;
    const subject = new Subject({ name, subjectCode, department });
    await subject.save();
    return success(res, subject, 'Subject created successfully', 201);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });
    return success(res, subjects, 'Subjects retrieved successfully');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
