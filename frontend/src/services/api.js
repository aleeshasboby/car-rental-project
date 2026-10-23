// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/',
});

// Automatic Bearer Token Header Attachment
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Graceful 401 Session Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Session expired or unauthorized. Clearing credentials.');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
