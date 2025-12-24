const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

// Models
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const HousekeepingTask = require('../models/HousekeepingTask');
const MaintenanceRequest = require('../models/MaintenanceRequest');

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    console.log('🧹 Cleaning Database...');
    await Room.deleteMany();
    await Booking.deleteMany();
    await Invoice.deleteMany();
    await HousekeepingTask.deleteMany();
    await MaintenanceRequest.deleteMany();
    // User delete nahi karenge taake apka login na ude

    console.log('🏨 Creating Luxury Rooms...');
    const roomTypes = [
      { num: '101', type: 'Standard', price: 100 }, { num: '102', type: 'Standard', price: 100 },
      { num: '201', type: 'Deluxe', price: 200 }, { num: '202', type: 'Deluxe', price: 200 },
      { num: '203', type: 'Deluxe', price: 200 }, { num: '301', type: 'Suite', price: 350 },
      { num: '302', type: 'Suite', price: 350 }, { num: '401', type: 'Luxury', price: 500 },
      { num: '402', type: 'Luxury', price: 500 }, { num: '501', type: 'Family', price: 400 },
    ];

    const rooms = await Room.insertMany(
        roomTypes.map(r => ({
            roomNumber: r.num,
            type: r.type,
            price: r.price,
            status: ['Available', 'Occupied', 'Cleaning'][Math.floor(Math.random() * 3)], // Random Status
            capacity: 2,
            description: `A beautiful ${r.type} room with city view.`
        }))
    );

    console.log('📅 Creating Bookings & Invoices (Past & Future)...');
    const admin = await User.findOne({ role: 'admin' });

    // Generate 10 Random Bookings
    const bookingsData = [];
    const invoicesData = [];

    for (let i = 0; i < 10; i++) {
        // Random Date in last 6 months (For Graphs)
        const date = new Date();
        date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
        
        const room = rooms[Math.floor(Math.random() * rooms.length)];
        const nights = Math.floor(Math.random() * 5) + 1;
        const total = room.price * nights;

        const booking = await Booking.create({
            bookingId: `BK-${1000 + i}`,
            roomId: room._id,
            guestId: admin._id,
            checkIn: date,
            checkOut: new Date(date.getTime() + (86400000 * nights)),
            totalAmount: total,
            totalGuests: 2,
            status: ['Checked In', 'Confirmed', 'Checked Out'][Math.floor(Math.random() * 3)],
            createdAt: date // Important for Revenue Graph
        });

        // Add Invoice
        invoicesData.push({
            invoiceNumber: `INV-${1000 + i}`,
            bookingId: booking._id,
            guestId: admin._id,
            items: [{ description: 'Room Charges', quantity: nights, unitPrice: room.price, total: total }],
            subtotal: total,
            tax: total * 0.1,
            totalAmount: total * 1.1,
            status: 'Paid', // Paid for Revenue Graph
            createdAt: date // Same date as booking for accurate graph
        });
    }
    await Invoice.insertMany(invoicesData);

    console.log('🧹 Adding Housekeeping & Maintenance Tasks...');
    await HousekeepingTask.create({ room: rooms[0]._id, type: 'Deep Clean', priority: 'High', status: 'Pending' });
    await HousekeepingTask.create({ room: rooms[1]._id, type: 'Towel Change', priority: 'Low', status: 'In Progress' });
    
    await MaintenanceRequest.create({ 
        roomNumber: '202', type: 'Plumbing', priority: 'High', description: 'Leaking tap', status: 'Pending', reportedBy: 'Guest' 
    });

    console.log('✅ DATABASE FULLY LOADED!');
    process.exit();
  } catch (error) {
    // console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedData();