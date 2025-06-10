const { loadPatients } = require('../models/Patient');
const { loadStudents } = require('../models/Student');
const { loadStaff } = require('../models/Staff');

exports.getStats = (req, res) => {
  const patients = loadPatients();
  const students = loadStudents();
  const staff = loadStaff();

  const stats = {
    totalPatients: patients.length,
    totalStudents: students.length,
    totalStaff: staff.length
  };

  res.json(stats);
};
