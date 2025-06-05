const Service = require('../models/Service');
const Department = require('../models/Department');

// Barcha xizmatlarni olish
exports.getServices = async (req, res) => {
  try {
    const { department } = req.query;
    let query = {};
    
    if (department) {
      query.department = department;
    }

    const services = await Service.find(query).populate({
      path: 'department',
      select: 'name'
    });

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Yangi xizmat yaratish (admin uchun)
exports.createService = async (req, res) => {
  try {
    const { name, department, description, price, duration } = req.body;

    // Bo'lim mavjudligini tekshirish
    const dept = await Department.findById(department);
    if (!dept) {
      return res.status(404).json({ 
        success: false, 
        message: 'Bo\'lim topilmadi' 
      });
    }

    const service = await Service.create({
      name,
      department,
      description,
      price,
      duration
    });

    res.status(201).json({
      success: true,
      service
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};