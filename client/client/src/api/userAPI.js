import api from './axiosConfig';

export const userAPI = {
  // Saare users lao (Filters: role=staff, role=guest)
  getAllUsers: async (params) => {
    // params example: { role: 'staff', page: 1 }
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Single User Details
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Create New Staff (Admin Only)
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Update Profile (Photo upload ke liye Form Data use hoga)
  updateUser: async (id, userData) => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' } // Important for Images
    };
    const response = await api.put(`/users/${id}`, userData, config);
    return response.data;
  },

  // User ko delete/deactivate karna
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};