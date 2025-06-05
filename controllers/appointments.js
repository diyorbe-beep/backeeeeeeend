const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Yangi konsultatsiya yaratish
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, symptoms } = req.body;
    
    // Shifokorni tekshirish
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Shifokor topilmadi' });
    }
    
    // Vaqt bandligini tekshirish
    const existingAppointment = await Appointment.findOne({ 
      doctor: doctorId, 
      date, 
      time,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    if (existingAppointment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ushbu vaqt allaqachon band qilingan' 
      });
    }
    
    // Shifokorning ish vaqtini tekshirish
    if (!doctor.availableHours.includes(time)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Shifokor ushbu vaqtda ishlamaydi' 
      });
    }
    
    // Konsultatsiya yaratish
    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date,
      time,
      symptoms
    });
    
    res.status(201).json({
      success: true,
      appointment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Bemorning konsultatsiyalari
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate({
        path: 'doctor',
        select: 'specialization consultationFee',
        populate: {
          path: 'user',
          select: 'name avatar'
        }
      })
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Shifokorning konsultatsiyalari
exports.getDoctorAppointments = async (req, res) => {
  try {
    // Faqat shifokor uchun ruxsat
    const user = await User.findById(req.user.id);
    if (user.role !== 'doctor') {
      return res.status(403).json({ 
        success: false, 
        message: 'Faqat shifokorlar konsultatsiyalarni ko\'rishi mumkin' 
      });
    }
    
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Shifokor profili topilmadi' 
      });
    }
    
    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate({
        path: 'patient',
        select: 'name phone'
      })
      .sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Konsultatsiya holatini yangilash
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Konsultatsiya topilmadi' });
    }
    
    // Faqat shifokor yoki admin holatini yangilashi mumkin
    const user = await User.findById(req.user.id);
    const doctor = await Doctor.findOne({ user: req.user.id });
    
    if (user.role !== 'admin' && (!doctor || doctor._id.toString() !== appointment.doctor.toString())) {
      return res.status(403).json({ 
        success: false, 
        message: 'Faqat shifokor yoki admin holatini yangilashi mumkin' 
      });
    }
    
    appointment.status = status;
    await appointment.save();
    
    res.status(200).json({
      success: true,
      appointment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};