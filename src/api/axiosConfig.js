
import axios from 'axios';

// Direct URL likh dein taake confusion na ho
const BASE_URL = 'http://localhost:5000/api/v1'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// REQUEST INTERCEPTOR: attach token if present
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');
    if (token) {
      // token may sometimes have quotes — remove them
      token = token.replace(/"/g, '');
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: handle 401 centrally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Clear local state to avoid invalid JSON parse/loops
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optional: you may broadcast an event for global logout handling
      // window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

export default api;
