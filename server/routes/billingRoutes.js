const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');

// --- 1. GET ALL INVOICES (Admin List ke liye) ---
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ issuedDate: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- 2. SAVE INVOICE (Fixed Duplicate Error) ---
router.post('/', async (req, res) => {
  try {
    const { bookingId, guestName, roomNumber, items, subTotal, taxAmount, totalAmount, status } = req.body;

    // Validation
    if (!bookingId || !totalAmount) {
        return res.status(400).json({ message: "Invalid Data" });
    }

    // ✅ Generate Unique Invoice Number
    const uniqueInvNum = "INV-" + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);

    const newInvoice = new Invoice({
      bookingId,
      guestName,
      roomNumber,
      invoiceNumber: uniqueInvNum, // Unique ID
      items,
      subTotal,
      taxAmount,
      totalAmount,
      status: status || 'Paid',
      issuedDate: new Date()
    });

    const savedInvoice = await newInvoice.save();
    
    console.log("✅ Invoice Saved:", savedInvoice.invoiceNumber);
    res.status(201).json(savedInvoice);

  } catch (err) {
    console.error("Invoice Save Error:", err);
    if (err.code === 11000) {
        return res.status(400).json({ message: "Invoice Number clash. Please try again." });
    }
    res.status(500).json({ message: err.message });
  }
});

// --- 3. SEARCH BOOKING (Admin Bill Generate karne ke liye) ---
router.get('/search/:bookingId', async (req, res) => {
    try {
        const booking = await Booking.findOne({ 
            $or: [
                { bookingId: req.params.bookingId }, 
                { _id: req.params.bookingId.match(/^[0-9a-fA-F]{24}$/) ? req.params.bookingId : null }
            ]
        }).populate('room'); 
        
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        res.json(booking);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- 4. GET BILL BY ROOM (Guest Dashboard ke liye - NEW ADDED) 🟢 ---
router.get('/room/:roomNumber', async (req, res) => {
  try {
    const { roomNumber } = req.params;
    console.log("🔎 Searching Bill for Room:", roomNumber);

    // Latest bill dhoondo jo us room ka ho
    const bill = await Invoice.findOne({ 
      roomNumber: { $regex: new RegExp(`^${roomNumber}$`, 'i') } // Case Insensitive Match
    }).sort({ issuedDate: -1 });

    if (!bill) {
        return res.status(404).json({ message: "No active bill found" });
    }
    
    res.json(bill);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;