// backend/controllers/bookingcontroller.js
import Booking from '../models/booking.js';

// Create a new booking
export const createBooking = async (req, res) => {
  const booking = new Booking(req.body);
  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get bookings by user email
export const getBookingsByEmail = async (req, res) => {
  try {
    const userBookings = await Booking.find({ userEmail: req.params.email }).populate('car');
    res.status(200).json(userBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};