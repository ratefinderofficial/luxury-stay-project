const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

// 1. GET ALL ROOMS (Guest & Admin dono ke liye)
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find(); // Saare rooms lao
    res.json(rooms); // Array bhejo
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET SINGLE ROOM (Details page ke liye)
router.get('/:id', async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. CREATE ROOM (Admin ke liye)
router.post('/', async (req, res) => {
  try {
    const newRoom = new Room(req.body);
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. UPDATE ROOM
router.put('/:id', async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRoom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. DELETE ROOM
router.delete('/:id', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;