const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB ga ulandi');
  } catch (err) {
    console.error('MongoDB ulanishda xato:', err);
    process.exit(1);
  }
};

module.exports = connectDB;