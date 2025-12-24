const Booking = require('../models/Booking');
const Room = require('../models/Room');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create Booking
// @route   POST /api/v1/bookings
exports.createBooking = asyncHandler(async (req, res, next) => {
  const { roomId, checkIn, checkOut, guestId, totalGuests } = req.body;

  // 1. Check Room
  const room = await Room.findById(roomId);
  if (!room) return res.status(404).json({ message: 'Room not found' });

  // 2. Check Availability (Overlap Logic)
  const isBooked = await Booking.findOne({
    roomId,
    status: { $nin: ['Cancelled', 'Checked Out'] }, // Check active bookings only
    $or: [
      { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
      { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } }
    ]
  });

  if (isBooked) {
    return res.status(400).json({ success: false, message: 'Room is already booked for these dates' });
  }

  // 3. Calculate Amount
  const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  const totalAmount = nights * room.price;

  const booking = await Booking.create({
    bookingId: `BK-${Date.now()}`,
    roomId,
    guestId: guestId || req.user._id,
    checkIn,
    checkOut,
    totalAmount,
    totalGuests: totalGuests || 1,
    status: 'Confirmed'
  });

  res.status(201).json({ success: true, booking });
});

// @desc    Get All Bookings (With Search & Pagination)
// @route   GET /api/v1/bookings
exports.getAllBookings = asyncHandler(async (req, res, next) => {
  const { search, status, page = 1, limit = 10 } = req.query;
  let query = {};

  // 1. Filter by Status
  if (status && status !== 'All' && status !== '') {
    query.status = status;
  }

  // 2. Search by Booking ID
  if (search) {
    query.bookingId = { $regex: search, $options: 'i' };
  }

  // 3. Pagination Logic
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const bookings = await Booking.find(query)
    .populate('roomId', 'roomNumber type')
    .populate('guestId', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalDocs = await Booking.countDocuments(query);

  // 4. Safe Formatting (To prevent crash if Room/Guest is deleted)
  const formatted = bookings.map(b => ({
    _id: b._id,
    bookingId: b.bookingId,
    guestName: b.guestId ? b.guestId.name : 'Unknown Guest',
    roomNumber: b.roomId ? b.roomId.roomNumber : 'N/A',
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    status: b.status,
    totalAmount: b.totalAmount
  }));

  res.status(200).json({ 
    success: true, 
    bookings: formatted,
    totalPages: Math.ceil(totalDocs / limit),
    currentPage: parseInt(page)
  });
});

// @desc    Get My Bookings (Guest)
exports.getMyBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ guestId: req.user._id })
    .populate('roomId', 'roomNumber type')
    .sort({ createdAt: -1 });
  
  const formatted = bookings.map(b => ({
    _id: b._id,
    bookingId: b.bookingId,
    roomType: b.roomId ? b.roomId.type : '-',
    roomNumber: b.roomId ? b.roomId.roomNumber : 'N/A',
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    totalAmount: b.totalAmount,
    status: b.status
  }));

  res.status(200).json({ success: true, bookings: formatted });
});

// @desc    Check-In
exports.checkIn = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  booking.status = 'Checked In';
  await booking.save();

  await Room.findByIdAndUpdate(booking.roomId, { status: 'Occupied' });

  res.status(200).json({ success: true, message: 'Check-in successful' });
});

// @desc    Check-Out
exports.checkOut = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  
  booking.status = 'Checked Out';
  await booking.save();

  await Room.findByIdAndUpdate(booking.roomId, { status: 'Cleaning' });

  res.status(200).json({ success: true, message: 'Check-out successful' });
});