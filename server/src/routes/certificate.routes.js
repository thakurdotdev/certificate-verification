const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificate.controller');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const upload = require('../utils/upload');
const validate = require('../middlewares/validate');
const ROLES = require('../constants/roles');
const {
  createCertificateSchema,
  updateCertificateSchema,
  verifyCertificateSchema,
  getAllQuerySchema,
  objectIdParam,
} = require('../validations/certificate.validation');

router.use(authenticate);

router.post('/', authorize(ROLES.STUDENT), upload.single('file'), validate({ body: createCertificateSchema }), certificateController.create);
router.get('/my', authorize(ROLES.STUDENT), certificateController.getMyCertificates);
router.get('/pending', authorize(ROLES.FACULTY), certificateController.getPending);
router.get('/all', authorize(ROLES.FACULTY), validate({ query: getAllQuerySchema }), certificateController.getAll);
router.get('/:id', validate({ params: objectIdParam }), certificateController.getById);
router.patch('/:id', authorize(ROLES.STUDENT), validate({ params: objectIdParam, body: updateCertificateSchema }), certificateController.update);
router.delete('/:id', authorize(ROLES.STUDENT), validate({ params: objectIdParam }), certificateController.remove);
router.post('/:id/verify', authorize(ROLES.FACULTY), validate({ params: objectIdParam, body: verifyCertificateSchema }), certificateController.verify);

module.exports = router;
