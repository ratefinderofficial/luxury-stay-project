const HousekeepingTask = require('../models/HousekeepingTask');
const Room = require('../models/Room');
const asyncHandler = require('../middleware/asyncHandler');

exports.getAllTasks = asyncHandler(async (req, res, next) => {
  const { status, assignedTo, date } = req.query;
  let query = {};

  if (status && status !== 'All') query.status = status;
  if (assignedTo) query.assignedStaff = assignedTo;
  
  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    query.scheduledDate = { $gte: startDate, $lt: endDate };
  }

  // ✅ Populate 'room' (Model se match karna chahiye)
  const tasks = await HousekeepingTask.find(query)
    .populate('room', 'roomNumber type') 
    .populate('assignedStaff', 'name')
    .sort({ createdAt: -1 });

  // Safe mapping (Agar room delete ho gaya ho to crash na ho)
  const formatted = tasks.map(t => ({
    _id: t._id,
    roomNumber: t.room ? t.room.roomNumber : 'N/A', // Safe Check
    roomType: t.room ? t.room.type : '-',
    type: t.type,
    priority: t.priority,
    status: t.status,
    assignedStaffName: t.assignedStaff ? t.assignedStaff.name : 'Unassigned',
    assignedStaffId: t.assignedStaff ? t.assignedStaff._id : null,
    scheduledDate: t.scheduledDate
  }));

  res.status(200).json({ success: true, count: tasks.length, tasks: formatted });
});

// ... (Baaki functions same rahenge: assignTask, updateTaskStatus, generateDailySchedule)
// Sirf getAllTasks main masla aata hai populate ka.
// Agar aapke paas baaki functions missing hain to bataiye main poora code de dunga.
// Filhal sirf getAllTasks replace karein.
exports.assignTask = asyncHandler(async (req, res, next) => {
  const task = await HousekeepingTask.findByIdAndUpdate(req.params.id, { 
    assignedStaff: req.body.staffId,
    status: 'Pending'
  }, { new: true });
  res.status(200).json({ success: true, task });
});

exports.updateTaskStatus = asyncHandler(async (req, res, next) => {
  const task = await HousekeepingTask.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (req.body.status === 'Completed') {
    await Room.findByIdAndUpdate(task.room, { status: 'Available' });
  }
  res.status(200).json({ success: true, task });
});

exports.generateDailySchedule = asyncHandler(async (req, res, next) => {
  const targetRooms = await Room.find({ status: { $in: ['Cleaning', 'Occupied'] } });
  const tasksToCreate = targetRooms.map(room => ({
    room: room._id,
    type: room.status === 'Cleaning' ? 'Deep Clean' : 'Daily Service',
    priority: 'Medium',
    status: 'Pending'
  }));
  await HousekeepingTask.insertMany(tasksToCreate);
  res.status(201).json({ success: true, message: `Generated ${tasksToCreate.length} tasks.` });
});