const mongoose = require('mongoose');
const { MONGO_URL } = require('./env');

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
