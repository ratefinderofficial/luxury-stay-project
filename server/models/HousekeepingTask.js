const mongoose = require('mongoose');

const housekeepingSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  taskType: { type: String, default: 'Daily Cleaning' }, // Daily Cleaning, Deep Cleaning, Laundry
  assignedTo: { type: String, required: true }, // Staff Name
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  dueDate: { type: Date, default: Date.now },
  instructions: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('HousekeepingTask', housekeepingSchema);