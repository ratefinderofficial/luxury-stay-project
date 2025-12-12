const express = require('express');
const { createPaymentIntent, confirmPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);

module.exports = router;