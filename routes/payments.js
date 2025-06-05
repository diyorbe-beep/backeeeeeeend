const express = require('express');
const { createPayment, confirmPayment } = require('../controllers/payments');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
  .post(protect, createPayment);

router.route('/:id/confirm')
  .put(protect, confirmPayment);

module.exports = router;