import api from './axiosConfig';

export const roomAPI = {
  getRooms: async (params) => {
    // URL '/rooms' hona chahiye ('/api' axiosConfig khud laga deta hai)
    const response = await api.get('/rooms', { params });
    return response.data.data;
  },

  getRoomById: async (id) => {
    const response = await api.get(`/rooms/${id}`);
    return response.data;
  },

  // Naya room add karna (Admin)
  createRoom: async (roomData) => {
    // Images ho sakti hain, isliye multipart header check karein
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    const response = await api.post('/rooms', roomData, config);
    return response.data;
  },

  updateRoom: async (id, roomData) => {
    const response = await api.put(`/rooms/${id}`, roomData);
    return response.data;
  },

  // Sirf Status update karna (Example: Housekeeping "Cleaning" se "Available" kare)
  updateRoomStatus: async (id, status) => {
    const response = await api.patch(`/rooms/${id}/status`, { status });
    return response.data;
  },

  deleteRoom: async (id) => {
    const response = await api.delete(`/rooms/${id}`);
    return response.data;
  }
};