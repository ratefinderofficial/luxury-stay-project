const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const userExists = await User.findOne({ email: 'admin@luxurystay.com' });

    if (userExists) {
      console.log('⚠️  Admin user already exists.'.yellow);
      process.exit();
    }

    // Create Admin User
    await User.create({
      name: 'Super Admin',
      email: 'admin@luxurystay.com',
      password: 'password123', // Ye password hash hoke save hoga
      phone: '+1 (555) 000-0000',
      role: 'admin',
      avatar: 'https://cdn-icons-png.flaticon.com/512/2206/2206368.png'
    });

    console.log('✅ Admin User Created Successfully!'.green.inverse);
    console.log('📧 Email: admin@luxurystay.com');
    console.log('🔑 Pass: password123');
    process.exit();

  } catch (error) {
    console.error(`❌ Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

seedAdmin();