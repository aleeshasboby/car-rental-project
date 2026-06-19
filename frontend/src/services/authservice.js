// frontend/src/services/authservice.js
import api from './api.js';

export const loginUser = async (email, password) => {
  const response = await api.post('auth/login', { email, password });
  
  if (response.data.token) {
    // 🟢 Changed from localStorage to sessionStorage for temporary sessions
    sessionStorage.setItem('token', response.data.token);
    sessionStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await api.post('auth/register', { name, email, password });
  return response.data;
};

export const logoutUser = () => {
  // 🟢 Wipe sessionStorage on explicit logout
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
};