const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Iltimos konsultatsiya sanasini kiriting']
  },
  time: {
    type: String,
    required: [true, 'Iltimos konsultatsiya vaqtini kiriting']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  symptoms: {
    type: String
  },
  diagnosis: {
    type: String
  },
  prescription: {
    type: String
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Appointment', appointmentSchema);