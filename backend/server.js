// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import carRoutes from './routes/carroutes.js';
import bookingRoutes from './routes/bookingroutes.js'; 
import authRoutes from './routes/authroutes.js';
import hubRoutes from './routes/hubroutes.js'; // 🟢 Added this line to import your hub paths

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// Link API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes); 
app.use('/api/hubs', hubRoutes); // 🟢 Added this line to mount the hub endpoints

app.get('/', (req, res) => {
  res.send('CarGo Backend API Server is Live! 🚗💨');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});