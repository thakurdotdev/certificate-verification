const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const ROLES = require('../constants/roles');

router.use(authenticate);

router.post('/', authorize(ROLES.ADMIN), userController.createUser);
router.get('/', authorize(ROLES.ADMIN), userController.getAllStudents);
router.get('/:id', authorize(ROLES.ADMIN, ROLES.FACULTY), userController.getUserById);
router.patch('/:id', authorize(ROLES.ADMIN), userController.updateUser);

module.exports = router;
