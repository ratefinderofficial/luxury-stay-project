const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// 1. PLACE ORDER (Guest)
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    
    // Notification Logic (Socket) yahan aa sakti hai
    const io = req.app.get('io');
    io.emit('new-order', { message: `🍔 New Order from Room ${req.body.roomNumber}` });

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 2. GET ALL ORDERS (Kitchen/Admin)
router.get('/', async (req, res) => {
  try {
    // Pending orders sabse upar
    const orders = await Order.find().sort({ status: 1, createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. UPDATE STATUS (Mark Delivered)
router.patch('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    
    // Yahan hum Auto-Billing ka logic bhi laga sakte hain (Baad mein)
    
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;