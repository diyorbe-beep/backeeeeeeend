const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');

// To'lovni amalga oshirish
exports.createPayment = async (req, res) => {
  try {
    const { appointmentId, amount, paymentMethod } = req.body;

    // Konsultatsiya tekshirish
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Konsultatsiya topilmadi' 
      });
    }

    // To'lov allaqachon mavjudligini tekshirish
    const existingPayment = await Payment.findOne({ appointment: appointmentId });
    if (existingPayment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ushbu konsultatsiya uchun to\'lov allaqachon amalga oshirilgan' 
      });
    }

    const payment = await Payment.create({
      appointment: appointmentId,
      amount,
      paymentMethod,
      status: paymentMethod === 'cash' ? 'completed' : 'pending'
    });

    // Agar to'lov muvaffaqiyatli bo'lsa, konsultatsiya holatini yangilash
    if (payment.status === 'completed') {
      appointment.paymentStatus = 'paid';
      await appointment.save();
    }

    res.status(201).json({
      success: true,
      payment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// To'lovni tasdiqlash (online to'lovlar uchun)
exports.confirmPayment = async (req, res) => {
  try {
    const { transactionId } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'completed',
        transactionId,
        paidAt: Date.now()
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'To\'lov topilmadi' 
      });
    }

    // Konsultatsiya holatini yangilash
    await Appointment.findByIdAndUpdate(payment.appointment, {
      paymentStatus: 'paid'
    });

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};