import api from './axiosConfig';

export const billingAPI = {
  // Backend Route: /api/billing
  getAllInvoices: async (params) => {
    const response = await api.get('/billing', { params });
    return response.data.data;
  },

  createInvoice: async (data) => {
    const response = await api.post('/billing', data);
    return response.data.data;
  },

  getInvoiceById: async (id) => {
    const response = await api.get(`/billing/${id}`);
    return response.data.data;
  },

  // PDF Download (Blob Response)
  getInvoicePdfUrl: (id) => {
    // Direct URL for window.open
    return `${import.meta.env.VITE_API_BASE_URL}/billing/${id}/pdf`;
  }
};