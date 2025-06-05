const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Barcha shifokorlarni olish
exports.getDoctors = async (req, res) => {
  try {
    // Filtrlash va saralash parametrlari
    const { specialization, minExperience, maxExperience, sort, search } = req.query;
    
    let query = {};
    
    // Mutaxassislik bo'yicha filtrlash
    if (specialization) {
      query.specialization = specialization;
    }
    
    // Tajriba bo'yicha filtrlash
    if (minExperience || maxExperience) {
      query.experience = {};
      if (minExperience) query.experience.$gte = minExperience;
      if (maxExperience) query.experience.$lte = maxExperience;
    }
    
    // Qidiruv
    if (search) {
      const users = await User.find({
        name: { $regex: search, $options: 'i' },
        role: 'doctor'
      });
      query.user = { $in: users.map(user => user._id) };
    }
    
    // Saralash
    let sortOption = {};
    if (sort) {
      if (sort === 'rating') sortOption.rating = -1;
      if (sort === 'experience') sortOption.experience = -1;
      if (sort === 'fee') sortOption.consultationFee = 1;
    } else {
      sortOption.createdAt = -1;
    }
    
    const doctors = await Doctor.find(query)
      .populate({
        path: 'user',
        select: 'name email phone avatar'
      })
      .sort(sortOption);
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Bitta shifokorni olish
exports.getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate({
        path: 'user',
        select: 'name email phone avatar'
      })
      .populate({
        path: 'reviews.user',
        select: 'name avatar'
      });
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Shifokor topilmadi' });
    }
    
    res.status(200).json({
      success: true,
      doctor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Shifokor yaratish (faqat admin yoki doctor rolidagilar uchun)
exports.createDoctor = async (req, res) => {
  try {
    // Foydalanuvchi doctor yoki admin ekanligini tekshirish
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin' && user.role !== 'doctor') {
      return res.status(403).json({ 
        success: false, 
        message: 'Faqat admin yoki doctor rolidagilar shifokor yaratishi mumkin' 
      });
    }
    
    const { specialization, experience, education, bio, consultationFee, availableHours } = req.body;
    
    const doctor = await Doctor.create({
      user: req.user.id,
      specialization,
      experience,
      education,
      bio,
      consultationFee,
      availableHours
    });
    
    // Foydalanuvchi rolini yangilash (agar doctor bo'lsa)
    if (user.role === 'patient') {
      user.role = 'doctor';
      await user.save();
    }
    
    res.status(201).json({
      success: true,
      doctor
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Shifokorga baho qo'yish
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Shifokor topilmadi' });
    }
    
    // Bemor allaqachon baho qo'yganligini tekshirish
    const alreadyReviewed = doctor.reviews.find(
      review => review.user.toString() === req.user.id.toString()
    );
    
    if (alreadyReviewed) {
      return res.status(400).json({ 
        success: false, 
        message: 'Siz allaqachon ushbu shifokorga baho qo\'ygansiz' 
      });
    }
    
    // Baho qo'shish
    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment
    };
    
    doctor.reviews.push(review);
    doctor.rating = doctor.reviews.reduce((acc, item) => item.rating + acc, 0) / doctor.reviews.length;
    
    await doctor.save();
    
    res.status(200).json({
      success: true,
      message: 'Baho qo\'shildi'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Kengaytirilgan qidiruv funksiyasi
exports.searchDoctors = async (req, res) => {
  try {
    const { search, department, minRating, maxFee } = req.query;
    
    let query = {};
    
    // Qidiruv bo'yicha filtrlash
    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ],
        role: 'doctor'
      });
      query.user = { $in: users.map(user => user._id) };
    }
    
    // Bo'lim bo'yicha filtrlash
    if (department) {
      const doctorsInDept = await Doctor.find({ specialization: department });
      query._id = { $in: doctorsInDept.map(doc => doc._id) };
    }
    
    // Reyting bo'yicha filtrlash
    if (minRating) {
      query.rating = { $gte: minRating };
    }
    
    // Narx bo'yicha filtrlash
    if (maxFee) {
      query.consultationFee = { $lte: maxFee };
    }
    
    const doctors = await Doctor.find(query)
      .populate({
        path: 'user',
        select: 'name email phone avatar'
      })
      .sort({ rating: -1 });
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};