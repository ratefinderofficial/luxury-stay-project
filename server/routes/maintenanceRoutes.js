const express = require('express');
const router = express.Router();
const Maintenance = require('../models/MaintenanceRequest');

// 1. GET ALL REQUESTS
router.get('/', async (req, res) => {
  try {
    // Pending pehle dikhaye, phir completed
    const requests = await Maintenance.find().sort({ status: 1, createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// /2. REPORT ISSUE
router.post('/', async (req, res) => {
  try {
    // 👇 YEH LINE ADD KARO (Console mein data dekhne ke liye)
    console.log("Frontend se aaya hua data:", req.body); 

    const newRequest = new Maintenance(req.body);
    await newRequest.save();
    
    console.log("Database mein Save ho gaya!"); // ✅ Success Log
    res.status(201).json(newRequest);
  } catch (err) {
    console.log("Saving Error:", err.message); // ❌ Error Log
    res.status(400).json({ message: err.message });
  }
});

// 3. UPDATE STATUS (Mark Fixed & Notify Guest)
router.patch('/:id', async (req, res) => {
  try {
    const updatedRequest = await Maintenance.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status },
      { new: true }
    );

    // 👇 REAL-TIME NOTIFICATION LOGIC
    if (updatedRequest) {
        const io = req.app.get('io');
        
        let message = "";
        if (updatedRequest.status === 'In Progress') {
            message = `🔧 Maintenance team is working on your issue (Room ${updatedRequest.roomNumber})`;
        } else if (updatedRequest.status === 'Completed') {
            message = `✅ Good News! The issue in Room ${updatedRequest.roomNumber} has been fixed.`;
        }

        if (message) {
            io.emit('notification', {
                room: updatedRequest.roomNumber,
                message: message,
                type: 'maintenance',
                timestamp: new Date()
            });
            console.log("🔔 Notification Sent:", message);
        }
    }

    res.json(updatedRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = router;