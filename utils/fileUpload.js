const multer = require('multer');
const path = require('path');

// Fayl saqlash joyini sozlash
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Fayl turini tekshirish
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Faqat rasm fayllari (jpg, jpeg, png) yuklash mumkin');
  }
}

const upload = multer({
  storage,
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  },
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB
  }
});

module.exports = upload;