const Diagnosis = require('../models/Diagnosis');
const Patient = require('../models/Patient');

// Yangi diagnostika qo'shish
exports.createDiagnosis = async (req, res) => {
  try {
    const { patientId, diagnosis, description } = req.body;
    
    const diagnosisRecord = await Diagnosis.create({
      patient: patientId,
      doctor: req.user.id,
      date: req.body.date || new Date(),
      diagnosis,
      description
    });

    res.status(201).json({
      success: true,
      diagnosis: diagnosisRecord
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Bemorning diagnostika tarixi
exports.getPatientDiagnoses = async (req, res) => {
  try {
    const diagnoses = await Diagnosis.find({ patient: req.params.patientId })
      .populate('doctor', 'name')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: diagnoses.length,
      diagnoses
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Barcha bemorlar ro'yxati
exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .select('name age gender avatar medicalId')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: patients.length,
      patients
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};