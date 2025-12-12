const ROLES = {
  ADMIN: 'admin',             // Full Access (Settings, Users, Reports)
  MANAGER: 'manager',         // Operations & Reports (No User Delete)
  RECEPTIONIST: 'receptionist', // Bookings, Check-in/out, Billing
  HOUSEKEEPING: 'housekeeping', // View Tasks, Update Room Status
  GUEST: 'guest'              // Only Public Portal & My Bookings
};

module.exports = ROLES;