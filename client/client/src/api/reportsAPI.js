import api from './axiosConfig';

export const reportsAPI = {
  // 1. General Stats (KPIs, Occupancy, Demographics)
  getDashboardStats: async () => {
    const response = await api.get('/reports/dashboard-stats');
    return response.data;
  },

  // 2. Revenue Trend Graph
  getRevenueStats: async () => {
    const response = await api.get('/reports/revenue');
    return response.data;
  }
};