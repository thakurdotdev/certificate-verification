const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const upload = require('../utils/upload');
const ROLES = require('../constants/roles');

router.use(authenticate);

router.get('/me', userController.getProfile);
router.patch('/me', upload.single('profileImage'), userController.updateProfile);

router.post('/', authorize(ROLES.FACULTY), upload.single('profileImage'), userController.createUser);
router.get('/', authorize(ROLES.FACULTY), userController.getAllStudents);
router.get('/faculty', authorize(ROLES.FACULTY), userController.getAllFaculty);
router.get('/:id', authorize(ROLES.FACULTY), userController.getUserById);
router.patch('/:id', authorize(ROLES.FACULTY), upload.single('profileImage'), userController.updateUser);

module.exports = router;
