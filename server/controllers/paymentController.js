// Stripe package load karein
// Agar aapne .env mein STRIPE_SECRET_KEY nahi dali, to ye crash ho sakta hai.
// Temporary fix ke liye maine 'sk_test_placeholder' rakha hai.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const asyncHandler = require('../middleware/asyncHandler');
const Invoice = require('../models/Invoice');

// @desc    Create Stripe Payment Intent
// @route   POST /api/v1/payments/create-intent
exports.createPaymentIntent = asyncHandler(async (req, res, next) => {
  const { amount, currency } = req.body;

  // Stripe expects amount in cents (e.g., $10.00 = 1000)
  // Math.round is important to avoid floating point errors
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), 
    currency: currency || 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});

// @desc    Confirm Payment & Update Database
// @route   POST /api/v1/payments/confirm
exports.confirmPayment = asyncHandler(async (req, res, next) => {
  const { invoiceId, paymentIntentId } = req.body;

  if (!invoiceId || !paymentIntentId) {
    return res.status(400).json({ success: false, message: 'Missing Data' });
  }

  // Update Invoice Status
  const invoice = await Invoice.findByIdAndUpdate(invoiceId, { 
    status: 'Paid',
    paymentId: paymentIntentId,
    paymentMethod: 'Credit Card (Stripe)'
  }, { new: true });

  if (!invoice) {
    return res.status(404).json({ success: false, message: 'Invoice not found' });
  }

  res.status(200).json({ success: true, invoice });
});