import api from './axiosConfig';

export const bookingAPI = {
  // Backend Route: /api/bookings (Plural)
  getAllBookings: async (params) => {
    const response = await api.get('/bookings', { params });
    return response.data.data; 
  },
  
  getMyBookings: async () => {
    const response = await api.get('/bookings/mybookings');
    return response.data.data;
  },

  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data.data;
  },

  createBooking: async (data) => {
    const response = await api.post('/bookings', data);
    return response.data.data;
  },

  checkIn: async (id) => {
    const response = await api.put(`/bookings/check-in/${id}`);
    return response.data.data;
  },

  checkOut: async (id) => {
    const response = await api.put(`/bookings/check-out/${id}`);
    return response.data.data;
  }
};