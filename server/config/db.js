const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Mongoose connection logic
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // Exit process with failure
        process.exit(1);
    }
};

// Ye line sabse important hai, iske bina server.js crash hoga
module.exports = connectDB;