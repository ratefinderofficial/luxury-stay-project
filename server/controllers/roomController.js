const Room = require('../models/Room');
const Booking = require('../models/Booking');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get All Rooms (Public + Filters)
// @route   GET /api/v1/rooms
exports.getAllRooms = asyncHandler(async (req, res, next) => {
  const { status, type, capacity, search, availableFrom, availableTo } = req.query;
  let query = {};

  // Filters
  if (status && status !== 'All') query.status = status;
  if (type && type !== 'All') query.type = type;
  if (capacity) query.capacity = { $gte: capacity };
  if (search) query.roomNumber = { $regex: search, $options: 'i' };

  // Date Availability Logic
  if (availableFrom && availableTo) {
    const overlapBookings = await Booking.find({
      $or: [
        { checkIn: { $lt: new Date(availableTo), $gte: new Date(availableFrom) } },
        { checkOut: { $gt: new Date(availableFrom), $lte: new Date(availableTo) } }
      ],
      status: { $ne: 'Cancelled' }
    }).select('roomId');

    const bookedRoomIds = overlapBookings.map(b => b.roomId);
    query._id = { $nin: bookedRoomIds };
  }

  const rooms = await Room.find(query);
  res.status(200).json({ success: true, count: rooms.length, rooms });
});

// @desc    Get Single Room
// @route   GET /api/v1/rooms/:id
exports.getRoomById = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }
  res.status(200).json({ success: true, data: room });
});

// @desc    Create Room (Admin)
// @route   POST /api/v1/rooms
exports.createRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.create(req.body);
  res.status(201).json({ success: true, room });
});

// @desc    Update Room Status
// @route   PATCH /api/v1/rooms/:id/status
exports.updateRoomStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const room = await Room.findByIdAndUpdate(req.params.id, { status }, { new: true });
  
  if (!room) {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }
  res.status(200).json({ success: true, room });
});

// @desc    Delete Room (Admin)
// @route   DELETE /api/v1/rooms/:id
exports.deleteRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findByIdAndDelete(req.params.id);
  
  if (!room) {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }
  res.status(200).json({ success: true, message: 'Room deleted successfully' });
});