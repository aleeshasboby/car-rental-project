// backend/models/user.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  
  // 👇 Add these 3 custom email verification fields
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  verificationToken: { 
    type: String, 
    default: null 
  },
  verificationTokenExpires: { 
    type: Date, 
    default: null 
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);