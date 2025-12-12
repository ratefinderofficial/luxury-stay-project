const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, default: 2 },
  currentStatus: { type: String, default: 'Available' },
  description: { type: String },
  images: [String], // Array of strings (URLs)
  amenities: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Room', roomSchema);