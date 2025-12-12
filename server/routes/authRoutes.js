const express = require('express');
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Private Routes (Token required)
router.get('/me', protect, getMe);
router.get('/logout', logout); // Optional if using cookies, else handled by frontend

module.exports = router;