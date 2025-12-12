const cron = require('node-cron');
const Booking = require('../models/Booking');
const Room = require('../models/Room');

// Schedule: Run every 15 minutes
// Syntax: '*/15 * * * *' -> At every 15th minute
const bookingCleanupJob = cron.schedule('*/15 * * * *', async () => {
    console.log('--- 🧹 Running Booking Cleanup Job ---');

    try {
        // 1. Calculate time threshold (e.g., 20 minutes ago)
        const timeLimit = new Date();
        timeLimit.setMinutes(timeLimit.getMinutes() - 20);

        // 2. Find bookings that are 'Pending' and older than 20 mins
        const expiredBookings = await Booking.find({
            status: 'Pending',
            createdAt: { $lt: timeLimit }
        });

        if (expiredBookings.length === 0) {
            // console.log('No expired bookings found.'); // Optional log to reduce noise
            return;
        }

        console.log(`Found ${expiredBookings.length} expired bookings. Processing...`);

        // 3. Process each expired booking
        for (const booking of expiredBookings) {
            // Update Booking Status
            booking.status = 'Cancelled';
            await booking.save();

            // Update Room Status back to Available
            if (booking.room) {
                await Room.findByIdAndUpdate(booking.room, {
                    status: 'Available'
                });
            }
        }

        console.log(`Successfully cancelled ${expiredBookings.length} unpaid bookings.`);

    } catch (error) {
        console.error('Error in Booking Cleanup Job:', error.message);
    }
}, {
    scheduled: false // We will start this manually in cronManager
});

module.exports = bookingCleanupJob;