// File: server/resetPass.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); // Path check kar lena
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const resetPassword = async () => {
  try {
    const email = 'admin@luxurystay.com';
    const newPassword = 'password123';
    
    // 1. User dhoondo
    const user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User nahi mila!');
      process.exit();
    }

    // 2. Password update karo
    // Mongoose ka pre-save hook isay khud hash kar dega
    user.password = newPassword;
    await user.save();

    console.log('✅ Success! Password reset to: password123');
    
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetPassword();