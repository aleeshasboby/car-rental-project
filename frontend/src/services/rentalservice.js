// frontend/src/services/rentalservice.js
import api from './api.js';

// Create a new rental booking
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings/create', bookingData);
  return response.data;
};

// Get all bookings belonging to a specific email
export const getUserBookings = async (email) => {
  const response = await api.get(`/bookings/${email}`);
  return response.data;
};