const ROOM_STATUS = {
  AVAILABLE: 'Available',     // Ready for check-in
  OCCUPIED: 'Occupied',       // Guest is currently staying
  CLEANING: 'Cleaning',       // Guest left, housekeeping in progress
  MAINTENANCE: 'Maintenance'  // Broken AC/Plumbing, cannot be booked
};

module.exports = ROOM_STATUS;