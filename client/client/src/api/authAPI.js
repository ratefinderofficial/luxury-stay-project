import api from './axiosConfig';

export const authAPI = {
  // Staff/Admin Login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Guest Registration
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Logout (Backend se cookie clear karwane ke liye)
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Forgot Password (Email bhejne ke liye)
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset Password (New password set karne ke liye)
  resetPassword: async (token, newPassword) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password: newPassword });
    return response.data;
  }
};