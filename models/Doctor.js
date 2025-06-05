const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: [true, 'Iltimos mutaxassislikni kiriting']
  },
  experience: {
    type: Number,
    required: [true, 'Iltimos tajribani kiriting']
  },
  education: {
    type: String,
    required: [true, 'Iltimos ta\'limni kiriting']
  },
  bio: {
    type: String
  },
  consultationFee: {
    type: Number,
    required: [true, 'Iltimos konsultatsiya narxini kiriting']
  },
  availableHours: {
    type: [String],
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        required: true
      },
      comment: {
        type: String
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Doctor', doctorSchema);