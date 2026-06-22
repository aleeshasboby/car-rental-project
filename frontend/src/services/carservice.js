// frontend/src/services/carservice.js
import axios from 'axios';
import api from './api.js';

const API_URL = 'http://localhost:5000/api';

/**
 * 1. FETCH ALL VEHICLES
 * Pulls the entire car inventory list from the system database
 */
export const getAllCars = async () => {
  const response = await axios.get(`${API_URL}/cars`);
  return response.data;
};

/**
 * 2. FETCH SINGLE VEHICLE PROFILE
 * Pulls full technical specs and relational details for an individual vehicle asset ID
 */
export const getCarById = async (id) => {
  const response = await axios.get(`${API_URL}/cars/${id}`);
  return response.data;
};

/**
 * 3. DEPLOY A NEW VEHICLE (Administrative Management Tool)
 * Sends a car configuration object containing a structural hub reference ID
 */
export const addCar = async (carData) => {
  const response = await api.post(`/cars`, carData);
  return response.data;
};

/**
 * 4. FETCH ALL ACTIVE PICKUP HUBS
 * Pulls the auto-seeded station locations (Cochin, TVM, Calicut) from the grid database
 */
export const getAllHubs = async () => {
  const response = await axios.get(`${API_URL}/hubs`);
  return response.data;
};