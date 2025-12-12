const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  idNumber: { type: String }, // CNIC / Passport
  preferences: { type: String }, // Veg, Non-veg, AC, etc.
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Guest', guestSchema);