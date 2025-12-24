const express = require('express');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Middleware
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Security: Sab routes ke liye login zaroori hai
router.use(protect);

// Security: Sirf Admin/Manager users list dekh sakte hain
router.route('/')
  .get(authorize('admin', 'manager'), getAllUsers)
  .post(authorize('admin'), createUser);

// Security: Specific user operations
router.route('/:id')
  .get(authorize('admin', 'manager'), getUserById)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

module.exports = router;