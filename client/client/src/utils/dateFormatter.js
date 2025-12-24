import { format, differenceInCalendarDays, parseISO } from 'date-fns';

// Format: "Oct 12, 2023"
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    return dateString;
  }
};

// Format: "Oct 12, 2023 - 02:30 PM"
export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM dd, yyyy - hh:mm a');
  } catch (error) {
    return dateString;
  }
};

// Format: "2023-10-12" (Input field value ke liye)
export const formatForInput = (date) => {
  if (!date) return '';
  return format(new Date(date), 'yyyy-MM-dd');
};

// Calculate Nights (e.g., 5 Nights)
export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return differenceInCalendarDays(end, start);
};