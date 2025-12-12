const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Logged in User ID
  
  // Guest Details
  guestName: { type: String, required: true },
  email: { type: String, required: true }, // 👈 YEH FIELD HONA ZAROORI HAI
  phone: { type: String },
  cnic: { type: String },
  address: { type: String },

  // Booking Info
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  totalAmount: { type: Number, required: true },
  guests: { type: Number, default: 1 },
  status: { type: String, default: 'Confirmed' },
  
  // Digital Key
  digitalKey: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);