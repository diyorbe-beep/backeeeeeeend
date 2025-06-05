const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Appointment',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Iltimos to\'lov miqdorini kiriting']
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online'],
    required: true
  },
  transactionId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paidAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);