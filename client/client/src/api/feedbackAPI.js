import api from './axiosConfig';

export const feedbackAPI = {
  // Feedback submit karna (Guest)
  submitFeedback: async (feedbackData) => {
    // feedbackData: { bookingId, rating: 5, comment: 'Great stay!' }
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  },

  // Saare reviews lana (Website par dikhane ke liye)
  getAllFeedback: async () => {
    const response = await api.get('/feedback');
    return response.data;
  },

  // Offensive feedback delete karna (Admin)
  deleteFeedback: async (id) => {
    const response = await api.delete(`/feedback/${id}`);
    return response.data;
  }
};