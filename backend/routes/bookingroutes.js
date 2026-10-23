// backend/routes/bookingroutes.js
import express from 'express';
import { verifyUser } from '../middleware/authmiddleware.js';
import { 
  createBooking, 
  getBookingsByEmail, 
  getAllBookings, 
  updateBookingStatus } from '../controllers/bookingcontroller.js';

const router = express.Router();

router.post('/create', verifyUser, createBooking);
router.get('/all', getAllBookings);
router.get('/:email', getBookingsByEmail);

router.patch('/:id/status', verifyUser, updateBookingStatus);

export default router;