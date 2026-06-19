// frontend/src/services/carservice.js
import api from './api.js';

// Get all cars from database
export const getAllCars = async () => {
  const response = await api.get('cars'); // Trims the leading slash to append safely
  return response.data;
};

// Get a single car record by its database ID
export const getCarById = async (id) => {
  const response = await api.get(`cars/${id.trim()}`); // Appends directly to /api/
  return response.data;
};

// Add a new car listing
export const addNewCar = async (carData) => {
  // 🟢 Changed from 'cars/add' to 'cars' to match your backend POST route exactly!
  const response = await api.post('cars', carData);
  return response.data;
};