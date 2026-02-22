const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const ROLES = require('../constants/roles');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.STUDENT,
  },
  rollNo: {
    type: String,
    sparse: true,
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  phone: {
    type: String,
    trim: true,
  },
  alternateEmail: {
    type: String,
    lowercase: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE'],
  },
  profileImage: {
    type: String,
  },
  semester: {
    type: Number,
    min: 1,
    max: 8,
  },
  grNo: {
    type: String,
    trim: true,
  },
  dob: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash') || !this.passwordHash) return;
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
