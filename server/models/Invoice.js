const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  guestName: { type: String, required: true },
  roomNumber: { type: String, required: true },
  
  // ✅ YEH HAI FIX: Unique Invoice Number
  invoiceNumber: { type: String, required: true, unique: true },

  items: [
    {
      description: String,
      amount: Number,
      qty: { type: Number, default: 1 }
    }
  ],
  subTotal: Number,
  taxAmount: Number,
  totalAmount: Number,
  status: { type: String, default: 'Paid' }, 
  issuedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);