// backend/routes/bookingroutes.js
import express from 'express';
import { 
  createBooking, 
  getBookingsByEmail, 
  getAllBookings, 
  updateBookingStatus } from '../controllers/bookingcontroller.js';

const router = express.Router();

router.post('/create', createBooking);
router.get('/all', getAllBookings);
router.get('/:email', getBookingsByEmail);

router.patch('/:id/status', updateBookingStatus);

export default router;