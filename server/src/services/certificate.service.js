const Certificate = require('../models/certificate.model');
const User = require('../models/user.model');
const STATUS = require('../constants/certificateStatus');
const { BASE_URL } = require('../config/env');

const addFullUrl = (certificate) => {
  if (!certificate) return certificate;
  const obj = certificate.toObject ? certificate.toObject() : certificate;
  if (obj.fileUrl && !obj.fileUrl.startsWith('http')) {
    obj.fileUrl = `${BASE_URL}${obj.fileUrl}`;
  }
  return obj;
};

const addFullUrlToMany = (certificates) => {
  return certificates.map(cert => addFullUrl(cert));
};

const create = async (studentId, data, file) => {
  if (!file) {
    const err = new Error('Certificate file is required');
    err.status = 400;
    throw err;
  }

  const certificate = new Certificate({
    studentId,
    name: data.name,
    title: data.title,
    description: data.description,
    subjectId: data.subjectId || null,
    subjectDate: data.subjectDate,
    fileUrl: `/uploads/${file.filename}`,
    fileType: file.mimetype,
    status: STATUS.PENDING,
    statusHistory: [{
      status: STATUS.PENDING,
      changedBy: studentId,
      comment: 'Certificate submitted',
    }],
  });

  await certificate.save();
  return addFullUrl(certificate);
};

const getByStudent = async (studentId) => {
  const certificates = await Certificate.find({ studentId })
    .populate('subjectId', 'name subjectCode')
    .populate('verifiedBy', 'name email')
    .populate('statusHistory.changedBy', 'name email role')
    .sort({ createdAt: -1 });
  return addFullUrlToMany(certificates);
};

const getPending = async (departmentId) => {
  const filter = { status: STATUS.PENDING };
  if (departmentId) {
    const students = await User.find({ departmentId, role: 'STUDENT' }).select('_id');
    filter.studentId = { $in: students.map(s => s._id) };
  }
  const certificates = await Certificate.find(filter)
    .populate('studentId', 'name email rollNo departmentId')
    .populate('subjectId', 'name subjectCode')
    .populate('statusHistory.changedBy', 'name email role')
    .sort({ createdAt: -1 });
  return addFullUrlToMany(certificates);
};

const getAll = async (departmentId) => {
  const filter = {};
  if (departmentId) {
    const students = await User.find({ departmentId, role: 'STUDENT' }).select('_id');
    filter.studentId = { $in: students.map(s => s._id) };
  }
  const certificates = await Certificate.find(filter)
    .populate('studentId', 'name email rollNo departmentId')
    .populate('subjectId', 'name subjectCode')
    .populate('verifiedBy', 'name email')
    .populate('statusHistory.changedBy', 'name email role')
    .sort({ createdAt: -1 });
  return addFullUrlToMany(certificates);
};

const getById = async (certificateId) => {
  const certificate = await Certificate.findById(certificateId)
    .populate('studentId', 'name email rollNo departmentId')
    .populate('subjectId', 'name subjectCode')
    .populate('verifiedBy', 'name email')
    .populate('statusHistory.changedBy', 'name email');
  
  if (!certificate) {
    const err = new Error('Certificate not found');
    err.status = 404;
    throw err;
  }
  return addFullUrl(certificate);
};

const update = async (certificateId, studentId, data) => {
  const certificate = await Certificate.findOne({ _id: certificateId, studentId });
  
  if (!certificate) {
    const err = new Error('Certificate not found');
    err.status = 404;
    throw err;
  }

  if (certificate.status !== STATUS.PENDING) {
    const err = new Error('Cannot modify certificate after verification');
    err.status = 400;
    throw err;
  }

  const { name, title, description, subjectId, subjectDate } = data;
  if (name) certificate.name = name;
  if (title) certificate.title = title;
  if (description !== undefined) certificate.description = description;
  if (subjectId) certificate.subjectId = subjectId;
  if (subjectDate) certificate.subjectDate = subjectDate;

  await certificate.save();
  return addFullUrl(certificate);
};

const remove = async (certificateId, studentId) => {
  const certificate = await Certificate.findOne({ _id: certificateId, studentId });
  
  if (!certificate) {
    const err = new Error('Certificate not found');
    err.status = 404;
    throw err;
  }

  if (certificate.status !== STATUS.PENDING) {
    const err = new Error('Cannot delete certificate after verification');
    err.status = 400;
    throw err;
  }

  await Certificate.deleteOne({ _id: certificateId });
  return { message: 'Certificate deleted successfully' };
};

const verify = async (certificateId, verifierId, status, remarks) => {
  if (!Object.values(STATUS).includes(status) || status === STATUS.PENDING) {
    const err = new Error('Invalid status. Use APPROVED or REJECTED');
    err.status = 400;
    throw err;
  }

  const certificate = await Certificate.findById(certificateId);
  
  if (!certificate) {
    const err = new Error('Certificate not found');
    err.status = 404;
    throw err;
  }

  if (certificate.status !== STATUS.PENDING) {
    const err = new Error('Certificate already verified');
    err.status = 400;
    throw err;
  }

  certificate.status = status;
  certificate.verifiedBy = verifierId;
  certificate.remarks = remarks;
  certificate.statusHistory.push({
    status,
    changedBy: verifierId,
    comment: remarks,
  });

  await certificate.save();
  return addFullUrl(certificate);
};

module.exports = { create, getByStudent, getPending, getAll, getById, update, remove, verify };
