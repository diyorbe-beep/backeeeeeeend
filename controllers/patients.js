const { loadPatients, savePatients } = require('../models/Patient');
const { v4: uuidv4 } = require('uuid');

// Barcha bemorlar
exports.getAllPatients = (req, res) => {
  const patients = loadPatients();
  res.json(patients);
};

// Bemor qo‘shish
exports.createPatient = (req, res) => {
  const patients = loadPatients();
  const newPatient = { id: uuidv4(), ...req.body };
  patients.push(newPatient);
  savePatients(patients);
  res.status(201).json(newPatient);
};

// Bitta bemorni olish
exports.getPatientById = (req, res) => {
  const patients = loadPatients();
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ message: 'Topilmadi' });
  res.json(patient);
};

// Tahrirlash
exports.updatePatient = (req, res) => {
  const patients = loadPatients();
  const index = patients.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Topilmadi' });
  patients[index] = { ...patients[index], ...req.body };
  savePatients(patients);
  res.json(patients[index]);
};

// O‘chirish
exports.deletePatient = (req, res) => {
  let patients = loadPatients();
  const index = patients.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Topilmadi' });
  const removed = patients.splice(index, 1);
  savePatients(patients);
  res.json(removed[0]);
};
