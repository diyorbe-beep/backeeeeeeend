const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    const { name, email, password, phone, role } = req.body;

    // Majburiy maydonlarni tekshirish
    if (!name || !email || !password || !phone) {
      console.log('Missing required fields:', { name, email, password, phone });
      return res.status(400).json({ success: false, message: "Barcha majburiy maydonlarni to'ldiring" });
    }

    // Email formatini tekshirish
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ success: false, message: "Noto'g'ri email format" });
    }

    // Parol uzunligini tekshirish
    if (password.length < 6) {
      console.log('Password too short:', password);
      return res.status(400).json({ success: false, message: "Parol kamida 6 belgidan iborat bo'lishi kerak" });
    }

    // Email allaqachon mavjudligini tekshirish
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already exists:', email);
      return res.status(400).json({ success: false, message: "Bu email allaqachon ro'yxatdan o'tgan" });
    }

    // Yangi foydalanuvchi yaratish
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'patient',
    });

    // Token generatsiya qilish
    const token = user.getJwtToken();
    console.log('User created successfully:', { id: user._id, email });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email va parol kiritilishi shart" });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: "Noto'g'ri email yoki parol" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Noto'g'ri email yoki parol" });
    }

    const token = user.getJwtToken();
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};