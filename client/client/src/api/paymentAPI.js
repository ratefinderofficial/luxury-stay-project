import api from './axiosConfig';

export const paymentAPI = {
  // 1. Stripe Payment Intent create karna
  createPaymentIntent: async (amount, currency = 'usd') => {
    const response = await api.post('/payments/create-intent', { amount, currency });
    return response.data; // Returns: { clientSecret: '...' }
  },

  // 2. Payment database mein record karna (After Stripe success)
  confirmPayment: async (paymentDetails) => {
    // paymentDetails: { bookingId, transactionId, amount, method: 'Credit Card' }
    const response = await api.post('/payments/confirm', paymentDetails);
    return response.data;
  },

  // Refund initiate karna
  processRefund: async (paymentId) => {
    const response = await api.post(`/payments/${paymentId}/refund`);
    return response.data;
  }
};