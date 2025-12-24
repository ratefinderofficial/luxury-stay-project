const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Invoice = require('../models/Invoice');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get Top KPIs (Revenue, Occupancy)
// @route   GET /api/v1/reports/dashboard-stats
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  
  // 1. Total Revenue (Paid Invoices)
  const revenueResult = await Invoice.aggregate([
    { $match: { status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  // 2. Counts
  const bookingsCount = await Booking.countDocuments();
  const activeGuests = await Booking.countDocuments({ status: 'Checked In' });
  const totalRooms = await Room.countDocuments();
  
  const occupancy = totalRooms > 0 
    ? Math.round((activeGuests / totalRooms) * 100) 
    : 0;

  // 3. Mock Data for Pie Charts (Frontend needs this structure)
  const roomOccupancy = [
    { name: 'Standard', value: 40 },
    { name: 'Deluxe', value: 30 },
    { name: 'Suite', value: 20 },
    { name: 'Luxury', value: 10 },
  ];

  const guestDemographics = [
    { name: 'Business', value: 60 },
    { name: 'Leisure', value: 30 },
    { name: 'Family', value: 10 },
  ];

  // Send JSON
  res.status(200).json({
    success: true,
    kpi: {
      revenue,
      occupancyRate: occupancy,
      totalGuests: bookingsCount, // Total historical guests
      adr: 120 // Mock ADR
    },
    roomOccupancy,
    guestDemographics
  });
});

// @desc    Get Monthly Revenue Trends (Graph Data)
// @route   GET /api/v1/reports/revenue
exports.getRevenueStats = asyncHandler(async (req, res, next) => {
  
  // 1. Database se Data nikalo (Group by Month)
  const revenueData = await Invoice.aggregate([
    { $match: { status: 'Paid' } },
    {
      $group: {
        _id: { $month: "$createdAt" }, // 1 for Jan, 2 for Feb...
        total: { $sum: "$totalAmount" }
      }
    }
  ]);

  // 2. Empty Months Fill Karo (Taake Graph complete dikhe)
  const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const formattedTrend = allMonths.map((monthName, index) => {
    // Check agar DB mein is mahine ka data hai
    const foundMonth = revenueData.find(d => d._id === (index + 1));
    const revenue = foundMonth ? foundMonth.total : 0;
    
    return {
      name: monthName,
      revenue: revenue,
      expenses: revenue * 0.4 // Mock Expense Logic
    };
  });

  res.status(200).json({
    success: true,
    revenueTrend: formattedTrend
  });
});