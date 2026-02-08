require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  BASE_URL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
};
