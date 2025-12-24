const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User'); // Path check karein
const connectDB = require('./config/db');

// Config load karein
dotenv.config();
connectDB();

const forceCreateAdmin = async () => {
  try {
    console.log('--- 🛠️ FIXING ADMIN ACCOUNT ---');
    const email = 'admin@luxurystay.com';
    const plainPassword = 'password123';

    // 1. Purana User Delete Karein
    await User.deleteOne({ email });
    console.log('1️⃣  Purana Admin delete kar diya.');

    // 2. Naya User Create Karein (Normal tareeqe se)
    // Hum "create" method use nahi karenge, "new User + save" karenge taake Hooks sahi chalen
    const user = new User({
      name: 'Super Admin',
      email: email,
      password: plainPassword, // Ye Model ke andar hash hoga
      role: 'admin',
      phone: '+1234567890',
      isActive: true
    });

    await user.save();
    console.log('2️⃣  Naya Admin Database mein save ho gaya.');

    // 3. TURANT CHECK KAREIN (Verification)
    // Ab hum database se wapas user mangwayenge aur password check karenge
    const savedUser = await User.findOne({ email }).select('+password');
    
    // Manual Check
    const isMatch = await savedUser.matchPassword(plainPassword);

    console.log('-------------------------------------------');
    if (isMatch) {
      console.log('✅ SUCCESS: Password Match ho gaya!');
      console.log(`📧 Email: ${email}`);
      console.log(`🔑 Pass: ${plainPassword}`);
      console.log('👉 Ab Browser mein jakar Login karein.');
    } else {
      console.log('❌ FAIL: Password match nahi hua. Model file mein masla hai.');
    }
    console.log('-------------------------------------------');

    process.exit();
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  }
};

forceCreateAdmin();