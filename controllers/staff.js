const { loadStaff, saveStaff } = require('../models/Staff');
const { v4: uuidv4 } = require('uuid');

// Barcha xodimlar
exports.getAllStaff = (req, res) => {
  const staff = loadStaff();
  res.json(staff);
};

// Yangi xodim qo‘shish
exports.createStaff = (req, res) => {
  const staff = loadStaff();
  const newStaff = { id: uuidv4(), ...req.body };
  staff.push(newStaff);
  saveStaff(staff);
  res.status(201).json(newStaff);
};

// Xodimni ID bo‘yicha olish
exports.getStaffById = (req, res) => {
  const staff = loadStaff();
  const person = staff.find(s => s.id === req.params.id);
  if (!person) return res.status(404).json({ message: 'Topilmadi' });
  res.json(person);
};

// Xodimni yangilash
exports.updateStaff = (req, res) => {
  const staff = loadStaff();
  const index = staff.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Topilmadi' });
  staff[index] = { ...staff[index], ...req.body };
  saveStaff(staff);
  res.json(staff[index]);
};

// O‘chirish
exports.deleteStaff = (req, res) => {
  let staff = loadStaff();
  const index = staff.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Topilmadi' });
  const removed = staff.splice(index, 1);
  saveStaff(staff);
  res.json(removed[0]);
};
