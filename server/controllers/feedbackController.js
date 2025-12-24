const Feedback = require('../models/Feedback');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get All Feedback
// @route   GET /api/v1/feedback
exports.getAllFeedback = asyncHandler(async (req, res, next) => {
  const reviews = await Feedback.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, reviews });
});

// @desc    Submit Feedback
// @route   POST /api/v1/feedback
exports.submitFeedback = asyncHandler(async (req, res, next) => {
  const { rating, comment, roomNumber } = req.body;

  // Validate request
  if (!rating || !comment) {
    return res.status(400).json({ success: false, message: 'Please provide rating and comment' });
  }

  const review = await Feedback.create({
    guestName: req.user ? req.user.name : 'Anonymous',
    roomNumber: roomNumber || 'N/A',
    rating,
    comment,
    createdAt: Date.now()
  });

  res.status(201).json({ success: true, review });
});

// @desc    Delete Feedback
// @route   DELETE /api/v1/feedback/:id
exports.deleteFeedback = asyncHandler(async (req, res, next) => {
  const review = await Feedback.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }

  await Feedback.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, message: 'Review deleted' });
});