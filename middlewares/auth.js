const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Foydalanuvchini autentifikatsiya qilish
exports.protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Ruxsatsiz kirish. Iltimos, tizimga kiring.' 
    });
  }
  
  try {
    // Tokenni tekshirish
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Ruxsatsiz kirish. Token noto\'g\'ri yoki muddati tugagan.' 
    });
  }
};

// Rol bo'yicha ruxsat berish
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Foydalanuvchi roli ${req.user.role} ushbu amalni bajarishga ruxsati yo'q` 
      });
    }
    next();
  };
};