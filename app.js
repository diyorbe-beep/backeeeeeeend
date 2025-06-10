require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const patientRoutes = require('./routes/patients');
const studentRoutes = require('./routes/students');
const staffRoutes = require('./routes/staff');
const parentRoutes = require('./routes/parent');
const statsRoutes = require('./routes/stats');
const uploadRoutes = require('./routes/upload');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB ulanish
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB ga ulandi'))
  .catch((err) => console.error('MongoDB ulanishda xato:', err));

// Asosiy route
app.get('/', (req, res) => {
  res.send('Shu Klinika Backend');
});

// Route-larni ulash
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/patients', patientRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/upload', uploadRoutes);






// Portni sozlash
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portida ishga tushdi`));