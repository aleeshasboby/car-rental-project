// backend/models/car.js
import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  type: { type: String, required: true },       
  fuelType: { type: String, required: true },   
  rentPerDay: { type: Number, required: true },
  image: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  
  hub: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hub', // 🟢 This string MUST match the exact capitalization of the registered model name ('Hub')
    required: true 
  }
}, { 
  timestamps: true,
  collection: 'cars' // 🟢 Explicitly handles the vehicles collection
});

export default mongoose.model('Car', carSchema);