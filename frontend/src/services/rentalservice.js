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

// Add/update this inside frontend/src/services/rentalservice.js

/**
 * Fetches all rental logs across the entire system for administrative review
 */
export const getAllBookings = async () => {
  try {
    // 🟢 Ensure this matches your backend admin booking route (usually /bookings or /bookings/all)
    const response = await api.get('/bookings'); 
    return response.data;
  } catch (error) {
    console.error("Error inside rentalservice.getAllBookings:", error.response?.data || error.message);
    throw error;
  }
};