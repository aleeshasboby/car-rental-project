// backend/routes/carroutes.js
import express from 'express';
import Car from '../models/car.js';

const router = express.Router();

// 1. Get all cars from the database
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Add a new car to the database
router.post('/add', async (req, res) => {
  const car = new Car(req.body);
  try {
    const newCar = await car.save();
    res.status(201).json(newCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;