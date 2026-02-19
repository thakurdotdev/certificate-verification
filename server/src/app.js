const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const certificateRoutes = require('./routes/certificate.routes');
const subjectRoutes = require('./routes/subject.routes');
const departmentRoutes = require('./routes/department.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Certificate Verification API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/departments', departmentRoutes);

app.use(errorMiddleware);

module.exports = app;
