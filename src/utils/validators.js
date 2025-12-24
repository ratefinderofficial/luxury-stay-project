// 1. Validate Email Format
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// 2. Validate Password Strength (Min 6 chars)
export const isStrongPassword = (password) => {
  // Simple: Min 6 chars
  // Strict: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return password && password.length >= 6;
};

// 3. Validate Phone Number (Basic check)
export const isValidPhone = (phone) => {
  const regex = /^\+?[0-9]{10,15}$/;
  return regex.test(phone);
};

// 4. Validate Booking Dates
export const areDatesValid = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return false;
  
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check-in past mein nahi hona chahiye
  if (start < today) return { valid: false, message: "Check-in date cannot be in the past" };

  // Check-out Check-in ke baad hona chahiye
  if (end <= start) return { valid: false, message: "Check-out must be after check-in" };

  return { valid: true };
};

// 5. Check Required Fields
export const isEmpty = (value) => {
  return value === null || value === undefined || value.toString().trim() === '';
};