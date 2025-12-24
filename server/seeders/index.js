const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db'); // Ensure this path is correct

// Import individual seeders
const seedAdmins = require('./adminSeeder');
const seedRooms = require('./roomSeeder');

// Load env vars
dotenv.config();

// Main Seeder Function
const runSeeders = async () => {
    try {
        // 1. Connect to Database
        await connectDB();
        
        console.log('🌱 Starting Data Seeding...');

        // 2. Run Users Seeder
        await seedAdmins();

        // 3. Run Rooms Seeder
        await seedRooms();

        console.log('🌱 Data Seeding Completed Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error with data seeding: ${error.message}`);
        process.exit(1);
    }
};

runSeeders();