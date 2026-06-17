// backend/models/Car.js
import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // e.g., SUV, Sedan, Hatchback
  fuelType: { type: String, required: true }, // e.g., Petrol, Diesel, Electric
  pricePerDay: { type: Number, required: true },
  image: { type: String, required: true }, // URL string for the car image
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt tracking fields

const Car = mongoose.model('Car', carSchema);
export default Car;