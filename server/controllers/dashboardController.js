const Booking = require('../models/Booking');
const Room = require('../models/Room');
const User = require('../models/User');
const HousekeepingTask = require('../models/HousekeepingTask');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const Invoice = require('../models/Invoice');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get Admin Dashboard Stats (Revenue, Occupancy, Activity)
// @route   GET /api/v1/dashboard/admin
exports.getAdminStats = asyncHandler(async (req, res, next) => {
  
  // 1. Total Revenue Calculation (From Paid Invoices or Completed Bookings)
  const revenueResult = await Invoice.aggregate([
    { $match: { status: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  // 2. Counts
  const totalBookings = await Booking.countDocuments();
  const activeGuests = await Booking.countDocuments({ status: 'Checked In' });
  const totalRooms = await Room.countDocuments();
  
  // 3. Occupancy Rate Logic
  const occupancyRate = totalRooms > 0 ? Math.round((activeGuests / totalRooms) * 100) : 0;

  // 4. Recent Activity Feed (Combine Bookings & Issues)
  const recentBookings = await Booking.find()
    .sort({ createdAt: -1 })
    .limit(3)
    .populate('guestId', 'name');
    
  const recentIssues = await MaintenanceRequest.find()
    .sort({ createdAt: -1 })
    .limit(2);

  // Formatting Activity for Frontend
  const recentActivity = [
    ...recentBookings.map(b => ({
      id: b._id,
      text: `New booking by ${b.guestId ? b.guestId.name : 'Guest'}`,
      time: b.createdAt,
      type: 'booking'
    })),
    ...recentIssues.map(i => ({
      id: i._id,
      text: `Issue reported in Room ${i.roomNumber}: ${i.type}`,
      time: i.createdAt,
      type: 'alert'
    }))
  ].sort((a, b) => new Date(b.time) - new Date(a.time)); // Sort by newest

  res.status(200).json({
    success: true,
    revenue: totalRevenue,
    occupancy: occupancyRate,
    bookings: totalBookings,
    guests: activeGuests,
    recentActivity
  });
});

// @desc    Get Staff Dashboard Stats (Operational Data)
// @route   GET /api/v1/dashboard/staff
exports.getStaffStats = asyncHandler(async (req, res, next) => {
  
  // Dates Setup (Start of today, End of today)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // 1. Arrivals (Check-in today)
  const arrivals = await Booking.countDocuments({
    checkIn: { $gte: todayStart, $lte: todayEnd },
    status: { $in: ['Confirmed', 'Pending'] }
  });

  // 2. Departures (Check-out today)
  const departures = await Booking.countDocuments({
    checkOut: { $gte: todayStart, $lte: todayEnd },
    status: 'Checked In'
  });

  // 3. Cleaning Tasks (Pending)
  const cleaningPending = await HousekeepingTask.countDocuments({
    status: { $in: ['Pending', 'In Progress'] }
  });

  // 4. Maintenance Issues (Active)
  const maintenanceIssues = await MaintenanceRequest.countDocuments({
    status: { $ne: 'Resolved' }
  });

  // 5. My Tasks (If staff logged in)
  // Assuming req.user.id is available via auth middleware
 const myTasks = await HousekeepingTask.find({
    assignedStaff: req.user.id,
    status: { $ne: 'Completed' }
  })
  .populate('room', 'roomNumber'); 

  const formattedTasks = myTasks.map(t => ({
    id: t._id,
    task: `${t.type} - Room ${t.room ? t.room.roomNumber : 'N/A'}`,
    priority: t.priority,
    status: t.status
  }));

  res.status(200).json({
    success: true,
    arrivals,
    departures,
    cleaningPending,
    maintenanceIssues,
    todayTasks: formattedTasks
  });
});