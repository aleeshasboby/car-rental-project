// backend/server.js
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // 👈 1. THIS MUST RUN FIRST!

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import carRoutes from './routes/carroutes.js';
import bookingRoutes from './routes/bookingroutes.js'; 
import authRoutes from './routes/authroutes.js'; // 👈 2. Safe to load now!
import hubRoutes from './routes/hubroutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// Link API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes); 
app.use('/api/hubs', hubRoutes); 

app.get('/', (req, res) => {
  res.send('CarGo Backend API Server is Live');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});