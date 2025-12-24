const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Generate a new Invoice
// @route   POST /api/v1/billing
exports.createInvoice = asyncHandler(async (req, res, next) => {
  const { bookingId, guestId, items, subtotal, tax, totalAmount, dueDate, status } = req.body;
  
  // Validation: Check if booking exists
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  const invoice = await Invoice.create({
    invoiceNumber: `INV-${Date.now()}`,
    bookingId,
    guestId,
    items,
    subtotal,
    tax,
    totalAmount,
    dueDate: dueDate || new Date(),
    status: status || 'Pending'
  });

  res.status(201).json({ success: true, invoice });
});

// @desc    Get All Invoices (With Search & Filter)
// @route   GET /api/v1/billing
exports.getAllInvoices = asyncHandler(async (req, res, next) => {
  const { search, status, page = 1, limit = 10 } = req.query;
  let query = {};

  // Status Filter
  if (status && status !== 'All') {
    query.status = status;
  }

  // Search Logic (Invoice Number or Guest Name lookup requires aggregation, simplified here)
  if (search) {
    query.invoiceNumber = { $regex: search, $options: 'i' };
  }

  const invoices = await Invoice.find(query)
    .populate('guestId', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Invoice.countDocuments(query);

  const formatted = invoices.map(inv => ({
    _id: inv._id,
    invoiceNumber: inv.invoiceNumber,
    guestName: inv.guestId ? inv.guestId.name : 'Unknown',
    guestEmail: inv.guestId ? inv.guestId.email : '-',
    totalAmount: inv.totalAmount,
    status: inv.status,
    createdAt: inv.createdAt
  }));

  res.status(200).json({ 
    success: true, 
    count: invoices.length,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    invoices: formatted 
  });
});

// @desc    Get Single Invoice
// @route   GET /api/v1/billing/:id
exports.getInvoiceById = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('guestId', 'name email address phone')
    .populate({
      path: 'bookingId',
      select: 'roomNumber checkIn checkOut',
      populate: { path: 'roomId', select: 'type' }
    });

  if (!invoice) {
    return res.status(404).json({ success: false, message: 'Invoice not found' });
  }

  res.status(200).json({ success: true, invoice });
});