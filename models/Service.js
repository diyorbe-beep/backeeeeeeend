const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Iltimos xizmat nomini kiriting']
  },
  department: {
    type: mongoose.Schema.ObjectId,
    ref: 'Department',
    required: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: [true, 'Iltimos xizmat narxini kiriting']
  },
  duration: {
    type: Number, // minutlarda
    required: [true, 'Iltimos xizmat davomiyligini kiriting']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', serviceSchema);