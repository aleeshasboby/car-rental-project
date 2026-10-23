// frontend/src/services/rentalservice.js
import api from './api.js';

/**
 * Create a new rental booking contract in the database engine
 * @param {Object} bookingData - Payload containing car, userEmail, startDate, endDate, totalPrice
 */
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings/create', bookingData);
  return response.data;
};

/**
 * Get all bookings belonging to a specific email
 * @param {string} email - The target lookup user email address string
 */
export const getUserBookings = async (email) => {
  const response = await api.get(`/bookings/${encodeURIComponent(email)}`);
  return response.data;
};

/**
 * Fetches all rental logs across the entire system for administrative review
 */
export const getAllBookings = async () => {
  try {
    const response = await api.get('/bookings/all');
    return response.data;
  } catch (error) {
    console.error("Error inside rentalservice.getAllBookings:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update the status of a specific booking contract
 */
export const updateBookingStatus = async (bookingId, status) => {
  const response = await api.patch(`/bookings/${bookingId}/status`, { status });
  return response.data;
};
