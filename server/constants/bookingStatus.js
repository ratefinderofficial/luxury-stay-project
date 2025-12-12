const BOOKING_STATUS = {
  PENDING: 'Pending',         // Payment not yet made / Approval needed
  CONFIRMED: 'Confirmed',     // Payment done, room reserved
  CHECKED_IN: 'Checked In',   // Guest has arrived
  CHECKED_OUT: 'Checked Out', // Guest left, room marked dirty
  CANCELLED: 'Cancelled'      // Booking voided
};

module.exports = BOOKING_STATUS;