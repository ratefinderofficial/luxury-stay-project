const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all users
// @route   GET /api/v1/users
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select('-password'); // Password mat bhejo
  res.status(200).json({ success: true, count: users.length, users });
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.status(200).json({ success: true, user });
});

// @desc    Create new user (Admin only)
// @route   POST /api/v1/users
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, user });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.status(200).json({ success: true, user });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.status(200).json({ success: true, message: 'User deleted' });
});