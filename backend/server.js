// backend/server.js
import './config/env.js'; // 👈 1. Loads .env before any other ES module imports execute!

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import connectDB from './config/db.js';
import carRoutes from './routes/carroutes.js';
import bookingRoutes from './routes/bookingroutes.js'; 
import authRoutes from './routes/authroutes.js'; // 👈 2. Safe to load now!
import hubRoutes from './routes/hubroutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// Security headers
app.use(helmet());

app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());

// Rate limiter: 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' },
});
app.use('/api', apiLimiter);

// Prevent NoSQL injection
app.use(mongoSanitize());

// Prevent HTTP parameter pollution
app.use(hpp());

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