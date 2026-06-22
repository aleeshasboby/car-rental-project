// frontend/src/services/rentalservice.js
import api from './api.js';

/**
 * Create a new rental booking contract in the database engine
 * @param {Object} bookingData - Payload structure containing carId, userEmail, dates, and totalPrice
 */
export const createBooking = async (bookingData) => {
  // 🟢 ALIGNED: Sends clean POST request matching your controller mapping parameters
  const response = await api.post('/bookings/create', bookingData);
  return response.data;
};

/**
 * Get all bookings belonging to a specific email context profile
 * @param {string} email - The target lookup user email address string
 */
export const getUserBookings = async (email) => {
  // 🟢 ALIGNED: Swapped structural pathing to match your live backend controller's query param expectations
  const response = await api.get(`/bookings/my-reservations?email=${email}`);
  return response.data;
};