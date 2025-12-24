import api from './axiosConfig';

export const maintenanceAPI = {
  // Issue report karna (Guest ya Staff)
  reportIssue: async (issueData) => {
    // issueData: { roomId: '101', description: 'AC not working', priority: 'High' }
    const response = await api.post('/maintenance', issueData);
    return response.data;
  },

  getAllRequests: async (params) => {
    const response = await api.get('/maintenance', { params });
    return response.data;
  },

  // Status update (Pending -> Resolved)
  updateStatus: async (id, status, notes) => {
    const response = await api.put(`/maintenance/${id}`, { status, notes });
    return response.data;
  }
};