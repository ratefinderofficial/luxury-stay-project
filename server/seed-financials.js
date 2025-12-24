const mongoose = require('mongoose');
const Booking = require('./models/Booking');
const Invoice = require('./models/Invoice');
const Room = require('./models/Room');
const User = require('./models/User');

const MONGO_URI = 'mongodb://127.0.0.1:27017/luxurystay_db';

const seedFinancials = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ DB Connected");

        const guest = await User.findOne({ role: 'Guest' });
        const room = await Room.findOne();

        if (!guest || !room) {
            console.log("❌ Please run 'npm run seed' first (Need Guest & Room)");
            process.exit();
        }

        console.log("🌱 Creating Dummy Bookings & Invoices...");

        // Create 5 Past Bookings (Paid)
        for (let i = 0; i < 5; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i); // Past dates

            const booking = await Booking.create({
                bookingId: `TEST-${100+i}`,
                room: room._id,
                user: guest._id,
                checkIn: date,
                checkOut: new Date(),
                totalGuests: 2,
                totalAmount: 500,
                status: 'CheckedOut',
                paymentStatus: 'Paid',
                createdAt: date // Force create date
            });

            await Invoice.create({
                invoiceNumber: `INV-${100+i}`,
                booking: booking._id,
                guest: guest._id,
                items: [{ description: 'Room Charge', quantity: 1, unitPrice: 500, total: 500 }],
                subtotal: 500,
                taxAmount: 50,
                totalAmount: 550,
                status: 'Paid',
                createdAt: date // Force create date
            });
        }

        console.log("🎉 Financial Data Seeded!");
        process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedFinancials();