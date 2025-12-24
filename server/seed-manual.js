const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Hardcoded Connection String (127.0.0.1 use karenge)
const MONGO_URI = 'mongodb://127.0.0.1:27017/luxurystay_db';

// 2. User Schema Define (Inline)
const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, default: 'guest' },
    isActive: { type: Boolean, default: true }
});

const User = mongoose.model('User', userSchema);

// 3. Main Logic
const seedData = async () => {
    try {
        console.log('⏳ Connecting to Database...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected!');

        console.log('🧹 Clearing old users...');
        await User.deleteMany({});

        console.log('👤 Creating Admin...');
        
        // Password Hash Manually
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        await User.create({
            name: 'Super Admin',
            email: 'admin@luxurystay.com',
            password: hashedPassword,
            role: 'Admin',
            isActive: true
        });

        console.log('🎉 SUCCESS! Admin Created.');
        console.log('📧 Email: admin@luxurystay.com');
        console.log('🔑 Pass: password123');

        // Connection Band karo
        await mongoose.disconnect();
        console.log('👋 Connection Closed.');
        process.exit();

    } catch (error) {
        console.error('❌ ERROR:', error);
        process.exit(1);
    }
};

seedData();