const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificate.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const upload = require('../utils/upload');
const ROLES = require('../constants/roles');

router.use(authenticate);

router.post('/', authorize(ROLES.STUDENT), upload.single('file'), certificateController.create);
router.get('/my', authorize(ROLES.STUDENT), certificateController.getMyCertificates);
router.get('/pending', authorize(ROLES.FACULTY, ROLES.ADMIN), certificateController.getPending);
router.get('/:id', certificateController.getById);
router.patch('/:id', authorize(ROLES.STUDENT), certificateController.update);
router.delete('/:id', authorize(ROLES.STUDENT), certificateController.remove);
router.post('/:id/verify', authorize(ROLES.FACULTY, ROLES.ADMIN), certificateController.verify);

module.exports = router;
