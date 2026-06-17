// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import carRoutes from './routes/carroutes.js'; // Import our new lowercase routes

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// Link car API endpoints
app.use('/api/cars', carRoutes);

app.get('/', (req, res) => {
  res.send('CarGo Backend API Server is Live! 🚗💨');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});