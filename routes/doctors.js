const express = require('express');
const { 
  getDoctors, 
  getDoctor, 
  createDoctor, 
  createReview 
} = require('../controllers/doctors');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
  .get(getDoctors)
  .post(protect, authorize('admin', 'doctor'), createDoctor);

router.route('/:id')
  .get(getDoctor);

router.route('/:id/reviews')
  .post(protect, authorize('patient'), createReview);

module.exports = router;