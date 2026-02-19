const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const ROLES = require('../constants/roles');

router.use(authenticate);

router.post('/', authorize(ROLES.FACULTY), userController.createUser);
router.get('/', authorize(ROLES.FACULTY), userController.getAllStudents);
router.get('/faculty', authorize(ROLES.FACULTY), userController.getAllFaculty);
router.get('/:id', authorize(ROLES.FACULTY), userController.getUserById);
router.patch('/:id', authorize(ROLES.FACULTY), userController.updateUser);

module.exports = router;
