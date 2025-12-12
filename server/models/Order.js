const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  guestName: { type: String }, // Optional
  items: [
    {
      name: String,
      price: Number,
      qty: { type: Number, default: 1 }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Preparing', 'Delivered'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);