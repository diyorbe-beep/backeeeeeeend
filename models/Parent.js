const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/parents.json');

function loadParents() {
  if (!fs.existsSync(dataPath)) return [];
  const rawData = fs.readFileSync(dataPath);
  return JSON.parse(rawData);
}

function saveParents(parents) {
  fs.writeFileSync(dataPath, JSON.stringify(parents, null, 2));
}

module.exports = {
  loadParents,
  saveParents
};
