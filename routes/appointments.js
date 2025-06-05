const express = require('express');
const { 
  createAppointment, 
  getMyAppointments, 
  getDoctorAppointments, 
  updateAppointmentStatus 
} = require('../controllers/appointments');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
  .post(protect, authorize('patient'), createAppointment)
  .get(protect, getMyAppointments);

router.route('/doctor')
  .get(protect, authorize('doctor'), getDoctorAppointments);

router.route('/:id/status')
  .put(protect, authorize('doctor', 'admin'), updateAppointmentStatus);

module.exports = router;