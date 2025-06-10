const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Faylni saqlash sozlamasi
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + '-' + file.fieldname + ext;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maks 5 MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (ext) cb(null, true);
    else cb(new Error('Faqat JPG, PNG va PDF fayllar ruxsat etiladi!'));
  }
});

// POST /api/upload
router.post('/', upload.single('file'), (req, res) => {
  res.json({
    message: 'Yuklandi!',
    fileUrl: `/uploads/${req.file.filename}`
  });
});

module.exports = router;
