import axios from 'axios';

// Backend URL set karo
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1', // Apna Backend URL check karlena
});

// --- INTERCEPTOR (Jasoos) ---
// Ye har request jane se pehle check karega
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Browser se Token nikalo
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Header mein laga do
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;