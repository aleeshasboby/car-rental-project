// backend/controllers/bookingcontroller.js
import Booking from '../models/booking.js';
import Car from '../models/car.js';

export const createBooking = async (req, res) => {
  const booking = new Booking(req.body);
  try {
    const newBooking = await booking.save();
    await Car.findByIdAndUpdate(req.body.car, { isAvailable: false }); 
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getBookingsByEmail = async (req, res) => {
  try {
    const userBookings = await Booking.find({ userEmail: req.params.email }).populate('car');
    res.status(200).json(userBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('car'); 
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching admin bookings:", error);
    res.status(500).json({ message: "Failed to retrieve administrative rental records" });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; const updatedBooking = await Booking.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking record not found." });
    }

    if (status === 'Cancelled') {
      await Car.findByIdAndUpdate(updatedBooking.car, { isAvailable: true });
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: error.message });
  }
};