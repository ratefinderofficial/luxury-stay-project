const express = require('express');
const router = express.Router();
const HousekeepingTask = require('../models/HousekeepingTask');

// 1. GET ALL TASKS
router.get('/', async (req, res) => {
  try {
    const tasks = await HousekeepingTask.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. ASSIGN NEW TASK (Create)
router.post('/', async (req, res) => {
  try {
    const newTask = new HousekeepingTask(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. UPDATE STATUS (Mark Complete & Notify Guest)
router.patch('/:id', async (req, res) => {
  try {
    const updatedTask = await HousekeepingTask.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    // 👇 REAL-TIME NOTIFICATION LOGIC
    if (updatedTask) {
        const io = req.app.get('io'); // Socket instance lo
        
        let message = "";
        if (updatedTask.status === 'In Progress') {
            message = `🧹 Housekeeping has started cleaning Room ${updatedTask.roomNumber}`;
        } else if (updatedTask.status === 'Completed') {
            message = `✅ Your Room (${updatedTask.roomNumber}) is now Clean & Ready!`;
        }

        // Agar message hai to bhejo
        if (message) {
            io.emit('notification', {
                room: updatedTask.roomNumber,
                message: message,
                type: 'housekeeping',
                timestamp: new Date()
            });
            console.log("🔔 Notification Sent:", message);
        }
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// 4. DELETE TASK
router.delete('/:id', async (req, res) => {
  try {
    await HousekeepingTask.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;