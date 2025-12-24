// File: server/createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); // Path check kar lena
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    const email = 'admin@luxurystay.com';
    const password = 'password123';

    // 1. Agar koi purana/toota hua user hai to delete karo
    await User.deleteOne({ email });

    // 2. Naya Admin User define karo
    const user = new User({
      name: 'Super Admin',
      email: email,
      password: password, // Model isay khud hash kar lega
      phone: '+1234567890',
      role: 'admin',
      isActive: true
    });

    // 3. Zabardasti Save karo (Validation bypass karke taake error na aaye)
    await user.save({ validateBeforeSave: false });

    console.log('-----------------------------------');
    console.log('🎉 Admin User Created Successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log('-----------------------------------');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();