// backend/seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Car from './models/car.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Updated dataset mapping precisely to your Car schema constraints
const sampleCars = [
  { 
    name: 'Mahindra Thar', 
    type: 'SUV', 
    pricePerDay: 4500, 
    fuelType: 'Diesel', 
    seats: 4, 
    hubName: 'Chhatrapati Shivaji Airport (BOM)', 
    coordinates: { lat: 19.0896, lng: 72.8656 },
    address: 'Terminal 2 Premium Parking, Andheri East',
    image: '🚙' // Using the emoji string as a placeholder image value
  },
  { 
    name: 'Honda Civic', 
    type: 'Sedan', 
    pricePerDay: 1600, 
    fuelType: 'Petrol', 
    seats: 5, 
    hubName: 'Phoenix Marketcity Mall', 
    coordinates: { lat: 19.0865, lng: 72.8890 },
    address: 'Basement Level 2, LBS Marg, Kurla',
    image: '🚗'
  },
  { 
    name: 'Toyota Fortuner', 
    type: 'SUV', 
    pricePerDay: 6500, 
    fuelType: 'Diesel', 
    seats: 7, 
    hubName: 'Chhatrapati Shivaji Airport (BOM)', 
    coordinates: { lat: 19.0896, lng: 72.8656 },
    address: 'Terminal 2 Arrival Lane',
    image: '🚙'
  },
  { 
    name: 'Hyundai Verna', 
    type: 'Sedan', 
    pricePerDay: 1400, 
    fuelType: 'Petrol', 
    seats: 5, 
    hubName: 'Mumbai Central Railway Station', 
    coordinates: { lat: 18.9696, lng: 72.8193 },
    address: 'Main Gate Exit Yard, Area 1',
    image: '🚗'
  },
  { 
    name: 'Tata Nexon', 
    type: 'SUV', 
    pricePerDay: 2200, 
    fuelType: 'Electric', 
    seats: 5, 
    hubName: 'Phoenix Marketcity Mall', 
    coordinates: { lat: 19.0865, lng: 72.8890 },
    address: 'EV Charging Station, Mall Wing B',
    image: '🚙'
  },
  { 
    name: 'Maruti Swift', 
    type: 'Hatchback', 
    pricePerDay: 1100, 
    fuelType: 'Petrol', 
    seats: 5, 
    hubName: 'Mumbai Central Railway Station', 
    coordinates: { lat: 18.9696, lng: 72.8193 },
    address: 'Platform 1 Lane, West Side',
    image: '🚗'
  },
  // Add this inside the sampleCars array in backend/seed.js
{ 
  name: 'Tata Altroz', 
  type: 'Hatchback', 
  pricePerDay: 1300, 
  fuelType: 'Petrol', 
  seats: 5, 
  hubName: 'Kattakada Hub', 
  coordinates: { lat: 8.5068, lng: 77.0818 }, // Kattakada, Trivandrum Coordinates
  address: 'Near Private Bus Stand, Kattakada, Kerala',
  image: '🚗'
}
];

const seedDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing! Check your environment config variables.");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🍃 Connected to MongoDB for seeding...");

    await Car.deleteMany({});
    console.log("🗑️ Cleared old vehicle records...");

    await Car.insertMany(sampleCars);
    console.log("🚗 Successfully seeded live fleet inventory!");

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message || error);
    process.exit(1);
  }
};

seedDatabase();