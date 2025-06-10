const { loadParents, saveParents } = require('../models/Parent');
const { v4: uuidv4 } = require('uuid');

// Barcha ota-onalar
exports.getAllParents = (req, res) => {
  const parents = loadParents();
  res.json(parents);
};

// Yangi ota-ona qo‘shish
exports.createParent = (req, res) => {
  const parents = loadParents();
  const newParent = {
    id: uuidv4(),
    name: req.body.name,
    phone: req.body.phone,
    studentId: req.body.studentId
  };
  parents.push(newParent);
  saveParents(parents);
  res.status(201).json(newParent);
};

// Farzandga qarab topish
exports.getParentByStudentId = (req, res) => {
  const parents = loadParents();
  const found = parents.find(p => p.studentId === req.params.studentId);
  if (!found) return res.status(404).json({ message: 'Topilmadi' });
  res.json(found);
};
