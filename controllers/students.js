const { loadStudents, saveStudents } = require('../models/Student');
const { v4: uuidv4 } = require('uuid');

// Barcha talabalar
exports.getAllStudents = (req, res) => {
  const students = loadStudents();
  res.json(students);
};

// Talaba qo‘shish
exports.createStudent = (req, res) => {
  const students = loadStudents();
  const newStudent = { id: uuidv4(), ...req.body };
  students.push(newStudent);
  saveStudents(students);
  res.status(201).json(newStudent);
};

// Talabani olish
exports.getStudentById = (req, res) => {
  const students = loadStudents();
  const student = students.find(s => s.id === req.params.id);
  if (!student) return res.status(404).json({ message: 'Topilmadi' });
  res.json(student);
};

// Yangilash
exports.updateStudent = (req, res) => {
  const students = loadStudents();
  const index = students.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Topilmadi' });
  students[index] = { ...students[index], ...req.body };
  saveStudents(students);
  res.json(students[index]);
};

// O‘chirish
exports.deleteStudent = (req, res) => {
  let students = loadStudents();
  const index = students.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Topilmadi' });
  const removed = students.splice(index, 1);
  saveStudents(students);
  res.json(removed[0]);
};
