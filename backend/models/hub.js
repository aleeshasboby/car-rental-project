// backend/models/hub.js
import mongoose from 'mongoose';

const hubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, 
  latitude: { type: Number, required: true },          
  longitude: { type: Number, required: true }          
}, { 
  timestamps: true,
  collection: 'hubs' // 🟢 FORCES Mongoose to lock directly onto the lowercase 'hubs' collection map
});

export default mongoose.model('Hub', hubSchema);