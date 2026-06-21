// frontend/src/services/userservice.js
import api from './api.js';

/**
 * Admin Action: Fetch all registered user documents from MongoDB
 */
export const getAllUsers = async () => {
  const response = await api.get('cars/management/users');
  return response.data;
};

/**
 * Admin Action: Modify a user's platform capabilities (Promote to Admin / Demote)
 */
export const updateUserRole = async (userId, newRole) => {
  const response = await api.put(`cars/management/users/${userId}/role`, { role: newRole });
  return response.data;
};