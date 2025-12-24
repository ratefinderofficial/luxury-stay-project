const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User'); 
const Guest = require('../models/Guest'); 

// --- 1. CREATE BOOKING (Full Details + Digital Key) ---
router.post('/', async (req, res) => {
  try {
    let { 
      room, user, checkInDate, checkOutDate, totalAmount, guests, 
      roomNumber, guestName, email, phone, cnic, address 
    } = req.body;

    console.log("📨 Processing Booking for:", guestName);

    // Validate Room ID
    if (!mongoose.Types.ObjectId.isValid(room)) {
        const realRoom = await Room.findOne({ roomNumber: roomNumber });
        if (realRoom) {
            room = realRoom._id;
        } else {
            return res.status(400).json({ message: "Invalid Room ID or Room not found." });
        }
    }

    // CHECK 1: SINGLE ACTIVE BOOKING POLICY
    if (user) {
        const activeBooking = await Booking.findOne({
            user: user,
            status: { $in: ['Confirmed', 'Checked In', 'Pending'] }
        });

        if (activeBooking) {
            return res.status(400).json({ 
                message: "🚫 Restriction: You already have an active booking. Please checkout first." 
            });
        }
    }

    // CHECK 2: ROOM AVAILABILITY
    const roomConflict = await Booking.findOne({
        room: room,
        status: { $nin: ['Cancelled', 'Checked Out'] },
        $and: [
            { checkInDate: { $lt: new Date(checkOutDate) } },
            { checkOutDate: { $gt: new Date(checkInDate) } }
        ]
    });

    if (roomConflict) {
        return res.status(400).json({ 
            message: "🚫 Room Unavailable: Already booked for these dates." 
        });
    }

    // Generate IDs & Key
    const bookingCode = 'BK-' + Math.floor(10000 + Math.random() * 90000);
    const digitalKey = Math.floor(1000 + Math.random() * 9000).toString();

    // Save Booking
    const newBooking = new Booking({
      bookingId: bookingCode,
      room,
      user, 
      guestName: guestName || "Guest",
      email,
      phone,
      cnic,
      address,
      checkInDate,
      checkOutDate,
      totalAmount,
      guests,
      status: 'Confirmed',
      digitalKey: digitalKey
    });
    
    const savedBooking = await newBooking.save();
    console.log("✅ Booking Saved with Key:", digitalKey);

    // Update Room Status
    await Room.findByIdAndUpdate(room, { currentStatus: 'Occupied' });

    res.status(201).json({ 
        message: "Booking Successful", 
        booking: savedBooking 
    });

  } catch (err) {
    console.error("❌ Booking Fatal Error:", err);
    res.status(500).json({ message: "Booking Failed", error: err.message });
  }
});

// --- 2. GET ALL BOOKINGS ---
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('room', 'roomNumber type price')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- 3. GET MY BOOKINGS (Universal Search Fix) ---
router.get('/my-bookings', async (req, res) => {
    try {
        const { email, userId } = req.query;

        if (!email && !userId) {
            return res.status(400).json({ message: "Identity missing" });
        }

        const query = {
            $or: [
                { email: email },
                { user: userId }
            ]
        };

        const bookings = await Booking.find(query)
            .populate('room')
            .sort({ checkInDate: -1 });

        res.json(bookings);

    } catch (err) {
        console.error("My Bookings Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// --- 4. UPDATE BOOKING STATUS (Yeh wala Missing tha - Add kiya hai) ---
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body; // Frontend bhejega: "Checked In", "Checked Out"
    const bookingId = req.params.id;

    // 1. Booking Update karo
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: status },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 2. Room Status Auto-Update logic
    const roomId = updatedBooking.room;

    if (roomId) {
        if (status === 'Checked In') {
            await Room.findByIdAndUpdate(roomId, { currentStatus: 'Occupied' });
        } 
        else if (status === 'Checked Out') {
            await Room.findByIdAndUpdate(roomId, { currentStatus: 'Cleaning' });
        } 
        else if (status === 'Cancelled') {
            await Room.findByIdAndUpdate(roomId, { currentStatus: 'Available' });
        }
    }

    console.log(`✅ Status Updated to: ${status}`);
    res.json(updatedBooking);

  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;