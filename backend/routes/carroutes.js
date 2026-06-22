// backend/routes/carroutes.js
import express from 'express';
import Car from '../models/car.js';
import User from '../models/user.js'; 
import Hub from '../models/hub.js'; // 🟢 Ensure Hub model is explicitly imported for population reference
import { verifyAdmin } from '../middleware/authmiddleware.js';
const router = express.Router();

// 1. GET ALL CARS (Updated to populate Hub data maps!)
router.get('/', async (req, res) => {
  try {
    // 🟢 Tells Mongoose to automatically look up the Hub object using its stored ID reference
    const cars = await Car.find().populate({
      path: 'hub',
      model: Hub
    });

    // Data Sanitization Layer to safely ensure the UI handles legacy data smoothly
    const sanitizedCars = cars.map(car => {
      const carObj = car.toObject();
      return {
        ...carObj,
        // Fallback guard just in case a record doesn't map successfully
        hub: carObj.hub && typeof carObj.hub === 'object' ? carObj.hub : { name: "Unassigned Hub Terminal" }
      };
    });

    res.json(sanitizedCars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. GET SINGLE CAR BY ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate({
      path: 'hub',
      model: Hub
    });
    if (!car) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: "Invalid ID formatting or server issue" });
  }
});

// 3. 🟢 ADMIN ENDPOINT: Add a new vehicle to the inventory catalog
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const newCar = new Car(req.body);
    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. 🟢 ADMIN ENDPOINT: Fetch all registered users from database
router.get('/management/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. 🟢 ADMIN ENDPOINT: Update a user's role (Promote/Demote)
router.put('/management/users/:id/role', verifyAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified. Use "user" or "admin".' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role: role },
      { new: true } 
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    res.json({ message: `Successfully changed role to ${role}`, user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;