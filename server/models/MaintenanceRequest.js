const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
 
  roomNumber: { type: String, required: true }, // Key hai: 'roomNumber'
  issue: { type: String, required: true },      // Key hai: 'issue'
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  reportedBy: { type: String, default: 'Staff' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);