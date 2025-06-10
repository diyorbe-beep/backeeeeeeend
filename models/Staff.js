const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/staff.json');

function loadStaff() {
  if (!fs.existsSync(dataPath)) return [];
  const rawData = fs.readFileSync(dataPath);
  return JSON.parse(rawData);
}

function saveStaff(staff) {
  fs.writeFileSync(dataPath, JSON.stringify(staff, null, 2));
}

module.exports = {
  loadStaff,
  saveStaff
};
