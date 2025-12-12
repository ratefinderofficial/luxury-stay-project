const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  hotelName: { type: String, default: 'LuxuryStay' },
  email: { type: String, default: 'admin@luxurystay.com' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  currency: { type: String, default: 'USD ($)' },
  taxRate: { type: Number, default: 0 },
  serviceCharge: { type: Number, default: 0 },
  checkInTime: { type: String, default: '14:00' },
  checkOutTime: { type: String, default: '11:00' }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);