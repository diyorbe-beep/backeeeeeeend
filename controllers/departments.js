const Department = require('../models/Department');
const Doctor = require('../models/Doctor');

// Barcha bo'limlarni olish
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate({
      path: 'headDoctor',
      select: 'specialization',
      populate: {
        path: 'user',
        select: 'name'
      }
    });

    res.status(200).json({
      success: true,
      count: departments.length,
      departments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Yangi bo'lim yaratish (admin uchun)
exports.createDepartment = async (req, res) => {
  try {
    const { name, description, headDoctorId } = req.body;

    // Head doctor tekshirish
    if (headDoctorId) {
      const doctor = await Doctor.findById(headDoctorId);
      if (!doctor) {
        return res.status(404).json({ 
          success: false, 
          message: 'Shifokor topilmadi' 
        });
      }
    }

    const department = await Department.create({
      name,
      description,
      headDoctor: headDoctorId
    });

    res.status(201).json({
      success: true,
      department
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Bo'limga shifokor qo'shish
exports.addDoctorToDepartment = async (req, res) => {
  try {
    const { doctorId } = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Shifokor topilmadi' 
      });
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { doctors: doctorId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      department
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};