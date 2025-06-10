const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/patients.json');

// JSON fayldan bemorlar ro‘yxatini o‘qish
function loadPatients() {
  if (!fs.existsSync(dataPath)) return [];
  const rawData = fs.readFileSync(dataPath);
  return JSON.parse(rawData);
}

// Bemorlar ro‘yxatini saqlash
function savePatients(patients) {
  fs.writeFileSync(dataPath, JSON.stringify(patients, null, 2));
}

module.exports = {
  loadPatients,
  savePatients
};
