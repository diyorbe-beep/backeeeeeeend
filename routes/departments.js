const express = require('express');
const { 
  getDepartments, 
  createDepartment, 
  addDoctorToDepartment 
} = require('../controllers/departments');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
  .get(getDepartments)
  .post(protect, authorize('admin'), createDepartment);

router.route('/:id/doctors')
  .post(protect, authorize('admin'), addDoctorToDepartment);

module.exports = router;