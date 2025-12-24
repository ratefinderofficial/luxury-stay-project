const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const User = require('../models/User');

// 1. Protect routes (Check if user is logged in)
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Header mein 'Bearer <token>' check karo
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Token extract karo
    token = req.headers.authorization.split(' ')[1];
  }

  // Agar token nahi hai
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User dhoondo aur req.user mein set karo
    req.user = await User.findById(decoded.id);

    next(); // Aage jane do
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
});

// 2. Grant access to specific roles (RBAC)
// Example: authorize('admin', 'manager')
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }
    next();
  };
};