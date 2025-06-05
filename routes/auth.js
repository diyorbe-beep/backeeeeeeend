const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth'); // To'g'ri import

// Ro'yxatdan o'tish uchun POST yo'nalishi
router.post('/register', register);

// Tizimga kirish uchun POST yo'nalishi
router.post('/login', login);

module.exports = router;