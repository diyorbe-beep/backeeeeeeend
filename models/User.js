const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Iltimos ismingizni kiriting"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Iltimos email kiriting"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Iltimos to'g'ri email kiriting"],
  },
  password: {
    type: String,
    required: [true, "Iltimos parol kiriting"],
    minlength: [6, "Parol eng kamida 6 belgidan iborat bo'lishi kerak"],
    select: false,
  },
  phone: {
    type: String,
    required: [true, "Iltimos telefon raqam kiriting"],
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient',
  },
  address: { type: String },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Parolni hash qilish
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Parolni solishtirish
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// JWT token generatsiya qilish
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'doctor', 'patient'], default: 'patient' }
});

// Parolni hash qilish
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);