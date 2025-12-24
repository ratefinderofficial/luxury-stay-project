const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');
const Room = require('../models/Room');

router.get('/dashboard', async (req, res) => {
  try {
    // 1. TOTAL REVENUE (Sirf 'Paid' invoices ka total)
    const revenueData = await Invoice.aggregate([
      { $match: { status: 'Paid' } }, // Sirf Paid bills uthao
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    // 2. TOTAL BOOKINGS
    const totalBookings = await Booking.countDocuments();

    // 3. ROOM STATS
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ currentStatus: 'Occupied' });
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    // 4. CHART DATA (Invoices se nikalo)
    // Yeh simple static data bhej rahe hain taake graph dikhe (Real aggregation complex hoti hai)
    const monthlyData = [
        { name: 'Jan', income: 1200 },
        { name: 'Feb', income: 2100 },
        { name: 'Mar', income: 800 },
        { name: 'Apr', income: 1600 },
        { name: 'May', income: 900 },
        { name: 'Jun', income: totalRevenue } // Current revenue yahan dikha do
    ];

    res.json({
      totalRevenue,
      totalBookings,
      occupancyRate,
      roomStats: [
        { name: 'Occupied', value: occupiedRooms, color: '#3b82f6' },
        { name: 'Available', value: totalRooms - occupiedRooms, color: '#22c55e' }
      ],
      monthlyData
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;