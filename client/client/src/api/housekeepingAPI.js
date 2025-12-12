import api from './axiosConfig';

export const housekeepingAPI = {
  // Saare tasks lana (Pending, In-Progress, Completed)
  getAllTasks: async (params) => {
    const response = await api.get('/housekeeping', { params });
    return response.data;
  },

  // Manager cleaner ko task assign kare
  assignTask: async (taskId, staffId) => {
    const response = await api.put(`/housekeeping/${taskId}/assign`, { staffId });
    return response.data;
  },

  // Cleaner status update kare (e.g., "Room 101 Cleaned")
  updateTaskStatus: async (taskId, status) => {
    const response = await api.patch(`/housekeeping/${taskId}/status`, { status });
    return response.data;
  },

  // Auto-schedule generate karna (Manual trigger if needed)
  generateDailySchedule: async () => {
    const response = await api.post('/housekeeping/generate-schedule');
    return response.data;
  }
};