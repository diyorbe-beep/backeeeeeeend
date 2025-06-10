const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/students.json');

function loadStudents() {
  if (!fs.existsSync(dataPath)) return [];
  const rawData = fs.readFileSync(dataPath);
  return JSON.parse(rawData);
}

function saveStudents(students) {
  fs.writeFileSync(dataPath, JSON.stringify(students, null, 2));
}

module.exports = {
  loadStudents,
  saveStudents
};
