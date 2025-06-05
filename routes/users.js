const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Foydalanuvchi profilini yangilash
router.put('/me', protect, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Foydalanuvchi rasmini yangilash
router.put('/me/avatar', protect, async (req, res) => {
  try {
    const { avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;