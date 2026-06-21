// frontend/src/services/carservice.js
import api from './api.js';

export const getAllCars = async () => {
  const response = await api.get('cars');
  return response.data;
};

export const addCar = async (carData) => {
  const response = await api.post('cars/management/add', carData);
  return response.data;
};

export const updateCar = async (carId, carData) => {
  const response = await api.put(`cars/management/edit/${carId}`, carData);
  return response.data;
};

export const deleteCar = async (carId) => {
  const response = await api.delete(`cars/management/remove/${carId}`);
  return response.data;
};

/**
 * Public/User Action: Fetch profile records for a single specific vehicle by its MongoDB ID
 */
export const getCarById = async (carId) => {
  const response = await api.get(`cars/${carId}`);
  return response.data;
};

// frontend/src/services/carservice.js

// Fetch all fixed station hubs for dropdown lists
export const getAllHubs = async () => {
  const response = await api.get('hubs');
  return response.data;
};

// Admin operation to register a new hub terminal location
export const addHub = async (hubData) => {
  const response = await api.post('hubs/add', hubData);
  return response.data;
};