const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  roomNumber: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);