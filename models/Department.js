const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Iltimos bo\'lim nomini kiriting'],
    unique: true
  },
  description: {
    type: String
  },
  headDoctor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Doctor'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Department', departmentSchema);