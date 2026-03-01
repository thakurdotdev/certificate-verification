const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const upload = require('../utils/upload');
const validate = require('../middlewares/validate');
const ROLES = require('../constants/roles');
const { createUserSchema, updateUserSchema, updateProfileSchema, objectIdParam } = require('../validations/user.validation');

router.use(authenticate);

router.get('/me', userController.getProfile);
router.patch('/me', upload.single('profileImage'), validate({ body: updateProfileSchema }), userController.updateProfile);

router.post('/', authorize(ROLES.FACULTY), upload.single('profileImage'), validate({ body: createUserSchema }), userController.createUser);
router.get('/', authorize(ROLES.FACULTY), userController.getAllStudents);
router.get('/faculty', authorize(ROLES.FACULTY), userController.getAllFaculty);
router.get('/:id', authorize(ROLES.FACULTY), validate({ params: objectIdParam }), userController.getUserById);
router.patch('/:id', authorize(ROLES.FACULTY), upload.single('profileImage'), validate({ params: objectIdParam, body: updateUserSchema }), userController.updateUser);

module.exports = router;
