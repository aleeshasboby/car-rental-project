// frontend/src/services/carservice.js
import api from './api.js';

/**
 * 1. FETCH ALL VEHICLES
 * Pulls the entire car inventory list from the system database
 */
export const getAllCars = async () => {
  const response = await api.get('/cars');
  return response.data;
};

/**
 * 2. FETCH SINGLE VEHICLE PROFILE
 * Pulls full technical specs and relational details for an individual vehicle asset ID
 */
export const getCarById = async (id) => {
  const response = await api.get(`/cars/${id}`);
  return response.data;
};

/**
 * 3. DEPLOY A NEW VEHICLE (Administrative Management Tool)
 * Sends a car configuration object containing a structural hub reference ID
 */
export const addCar = async (carData) => {
  const response = await api.post('/cars', carData);
  return response.data;
};

/**
 * 4. FETCH ALL ACTIVE PICKUP HUBS
 * Pulls all station locations from the database
 */
export const getAllHubs = async () => {
  const response = await api.get('/hubs');
  return response.data;
};
