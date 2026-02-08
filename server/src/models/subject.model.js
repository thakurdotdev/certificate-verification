const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  subjectCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model('Subject', subjectSchema);
