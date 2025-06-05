require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

// Portni sozlash
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portida ishga tushdi`));