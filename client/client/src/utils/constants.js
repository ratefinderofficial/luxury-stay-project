// User Roles (RBAC)
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  RECEPTIONIST: 'receptionist',
  HOUSEKEEPING: 'housekeeping',
  GUEST: 'guest'
};

// Room Statuses
export const ROOM_STATUS = {
  AVAILABLE: 'Available',
  OCCUPIED: 'Occupied',
  CLEANING: 'Cleaning',
  MAINTENANCE: 'Maintenance'
};

// Booking Statuses
export const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CHECKED_IN: 'Checked In',
  CHECKED_OUT: 'Checked Out',
  CANCELLED: 'Cancelled'
};

// Room Types & Base Prices (Fallback data)
export const ROOM_TYPES = {
  STANDARD: { label: 'Standard Room', basePrice: 100 },
  DELUXE: { label: 'Deluxe Suite', basePrice: 180 },
  SUITE: { label: 'Executive Suite', basePrice: 250 },
  FAMILY: { label: 'Family Penthouse', basePrice: 400 },
  LUXURY: { label: 'Presidential Suite', basePrice: 1000 }
};

// Task Priorities
export const PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
};

// Application Config
export const APP_CONFIG = {
  CURRENCY: 'USD',
  TAX_RATE: 0.10, // 10%
  CONTACT_EMAIL: 'support@luxurystay.com',
  ITEMS_PER_PAGE: 10
};