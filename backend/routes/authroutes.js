// backend/routes/authroutes.js
import '../config/env.js';
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { isPasswordStrong, passwordRequirementsMessage, isEmailDeliverable } from '../utils/validators.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. Server cannot start without it.');
}

// ==========================================
// 1. REGISTER ROUTE (Direct Account Creation)
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are all required.' });
    }

    // --- VALIDATION: password strength ---
    if (!isPasswordStrong(password)) {
      return res.status(400).json({ message: passwordRequirementsMessage() });
    }

    // --- VALIDATION: email format & domain check ---
    const emailCheck = await isEmailDeliverable(email);
    if (!emailCheck.valid) {
      return res.status(400).json({ message: emailCheck.reason });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save user directly as active
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: true
    });

    await newUser.save();

    res.status(201).json({
      message: 'Registration successful! You can now log in.'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 2. LOGIN ROUTE (Direct Authentication)
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send back token and user metadata
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;