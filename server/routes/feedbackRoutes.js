const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// 1. GET ALL FEEDBACK (Admin ke liye)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }); // Newest first
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST FEEDBACK (Guest ke liye - Testing ke liye abhi Postman use kar lena)
router.post('/', async (req, res) => {
  const { guestName, roomNumber, rating, comment } = req.body;
  try {
    const newFeedback = new Feedback({ guestName, roomNumber, rating, comment });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. DELETE FEEDBACK (Admin ke liye)
router.delete('/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;