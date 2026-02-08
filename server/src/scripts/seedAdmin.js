const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    const passwordHash = await bcrypt.hash('admin123', 10);
    
    const admin = {
      name: 'Admin',
      email: 'admin@marwadi.edu.in',
      passwordHash,
      role: 'ADMIN',
      department: 'Administration',
      isActive: true,
      createdAt: new Date()
    };

    const result = await mongoose.connection.db.collection('users').insertOne(admin);
    console.log('✅ Admin created successfully!');
    console.log('Email: admin@marwadi.edu.in');
    console.log('Password: admin123');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.log('⚠️ Admin already exists with this email');
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
};

seedAdmin();
