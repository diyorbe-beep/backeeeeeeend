const express = require('express');
const router = express.Router();
const diagnosisController = require('../controllers/diagnosisController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, diagnosisController.createDiagnosis);

router.route('/patients')
  .get(protect, diagnosisController.getPatients);

router.route('/patients/:patientId')
  .get(protect, diagnosisController.getPatientDiagnoses);

module.exports = router;