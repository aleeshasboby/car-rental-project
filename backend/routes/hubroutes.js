// backend/routes/hubroutes.js
import express from 'express';
import Hub from '../models/hub.js';
const router = express.Router();

/**
 * 🚀 AUTO-SEED ENGINE
 * Inserts default fixed location hubs automatically on startup if your MongoDB 
 * collection is currently empty.
 */
const seedDefaultHubs = async () => {
  try {
    const count = await Hub.countDocuments();
    if (count === 0) {
      const defaultHubs = [
        { name: "Cochin International Airport Hub", latitude: 10.1522, longitude: 76.3924 },
        { name: "Thiruvananthapuram Central Hub", latitude: 8.4875, longitude: 76.9504 },
        { name: "Calicut Beach Station Hub", latitude: 11.2588, longitude: 75.7741 }
      ];
      await Hub.insertMany(defaultHubs);
      console.log("🌱 Database Matrix System: Default pickup hubs seeded successfully!");
    }
  } catch (err) {
    console.error("Failed to execute database auto-seed operation:", err);
  }
};

// Execute the seed engine immediately when this file is mounted by server.js
seedDefaultHubs();

// 1. GET ALL ACTIVE HUBS (Used by both admin dropdowns and public homepage searches)
router.get('/', async (req, res) => {
  try {
    const hubs = await Hub.find().sort({ name: 1 });
    res.status(200).json(hubs);
  } catch (err) {
    console.error("Backend Error fetching hubs:", err);
    res.status(500).json({ message: 'Failed to retrieve rental hubs.' });
  }
});

// 2. ADD NEW VEHICLE HUB TERMINAL (Administrative Management Tool)
router.post('/add', async (req, res) => {
  try {
    const newHub = new Hub(req.body);
    const savedHub = await newHub.save();
    res.status(201).json(savedHub);
  } catch (err) {
    console.error("Backend Error adding hub:", err);
    res.status(400).json({ message: 'Failed to register location hub.' });
  }
});

export default router;