const cron = require('node-cron');
const Room = require('../models/Room');
const HousekeepingTask = require('../models/HousekeepingTask'); // Ensure this model exists

// Schedule: Run every day at 02:00 AM
// Syntax: '0 2 * * *' -> At minute 0 of hour 2
const dailyCleaningJob = cron.schedule('0 2 * * *', async () => {
    console.log('--- 🧹 Running Daily Cleaning Assignment Job ---');

    try {
        // 1. Find all rooms that are currently occupied
        const occupiedRooms = await Room.find({ status: 'Occupied' });

        if (occupiedRooms.length === 0) {
            console.log('No occupied rooms found for daily cleaning.');
            return;
        }

        const tasksToCreate = [];
        const today = new Date();

        // 2. Prepare tasks for bulk creation
        occupiedRooms.forEach(room => {
            tasksToCreate.push({
                room: room._id,
                taskType: 'Daily Cleaning', // Enum should match your Schema
                priority: 'Medium',
                status: 'Pending',
                description: 'Automated daily service for occupied room.',
                assignedDate: today
            });
        });

        // 3. Insert tasks into Database
        if (tasksToCreate.length > 0) {
            await HousekeepingTask.insertMany(tasksToCreate);
            
            // Optional: Agar aap chahte hain ki room status bhi 'Cleaning' ho jaye:
            // await Room.updateMany({ status: 'Occupied' }, { status: 'Cleaning' });
            
            console.log(`Created ${tasksToCreate.length} housekeeping tasks for occupied rooms.`);
        }

    } catch (error) {
        console.error('Error in Daily Cleaning Job:', error.message);
    }
}, {
    scheduled: false
});

module.exports = dailyCleaningJob;