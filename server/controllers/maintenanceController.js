const MaintenanceRequest = require('../models/MaintenanceRequest');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Report Issue
exports.reportIssue = asyncHandler(async (req, res, next) => {
  const { roomNumber, type, priority, description } = req.body;

  const request = await MaintenanceRequest.create({
    roomNumber,
    type,
    priority,
    description,
    reportedBy: req.user ? req.user.name : 'Guest',
    status: 'Pending'
  });

  res.status(201).json({ success: true, request });
});

// @desc    Get All Requests (Fixing 500 Error)
exports.getAllRequests = asyncHandler(async (req, res, next) => {
  // Parsing inputs to Numbers to avoid crashes
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const { status } = req.query;
  
  let query = {};
  if (status && status !== 'All') {
    query.status = status;
  }

  // Debugging log (Optional)
  // console.log(`Maintenance Query: Page ${page}, Limit ${limit}`);

  const requests = await MaintenanceRequest.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(startIndex);

  const count = await MaintenanceRequest.countDocuments(query);

  res.status(200).json({ 
    success: true, 
    requests,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    totalItems: count
  });
});

// @desc    Update Status
exports.updateStatus = asyncHandler(async (req, res, next) => {
  const request = await MaintenanceRequest.findByIdAndUpdate(
    req.params.id, 
    { status: req.body.status }, 
    { new: true }
  );

  if (!request) {
    return res.status(404).json({ success: false, message: 'Request not found' });
  }

  res.status(200).json({ success: true, request });
});