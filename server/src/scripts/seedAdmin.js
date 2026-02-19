const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;

const seedFaculty = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    const dept = await mongoose.connection.db.collection('departments').insertOne({
      name: 'Computer Science',
    });
    console.log('✅ Department created: Computer Science');

    const passwordHash = await bcrypt.hash('faculty123', 10);

    const faculty = {
      name: 'Dr. Faculty',
      email: 'faculty@marwadi.edu.in',
      passwordHash,
      role: 'FACULTY',
      departmentId: dept.insertedId,
      isActive: true,
      createdAt: new Date(),
    };

    await mongoose.connection.db.collection('users').insertOne(faculty);
    console.log('✅ Faculty created successfully!');
    console.log('Email: faculty@marwadi.edu.in');
    console.log('Password: faculty123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.log('⚠️ Faculty or department already exists');
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
};

seedFaculty();
