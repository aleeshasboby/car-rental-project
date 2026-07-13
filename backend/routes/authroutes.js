// backend/routes/authroutes.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // 1. Built-in Node tool for generating high-security random keys
import User from '../models/user.js';
import { isPasswordStrong, passwordRequirementsMessage, isEmailDeliverable } from '../utils/validators.js';
import { sendVerificationEmail } from '../utils/mailer.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'cargo_super_secret_key_123';

// ==========================================
// 1. REGISTER ROUTE (Generates Secure Token)
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

    // --- VALIDATION: email is well-formed AND the domain can actually receive mail ---
    const emailCheck = await isEmailDeliverable(email);
    if (!emailCheck.valid) {
      return res.status(400).json({ message: emailCheck.reason });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a unique random hex string and set a 24-hour expiration date
    const uniqueToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // Current time + 24 hours

    // Create and save new user with verification metrics
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false, // Account locked out of the gate
      verificationToken: uniqueToken,
      verificationTokenExpires: tokenExpiry
    });

    await newUser.save();

    // Send the real verification email (instead of just logging it)
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify?token=${uniqueToken}`;

    try {
      await sendVerificationEmail(email, verificationUrl);
    } catch (mailErr) {
      
      return res.status(500).json({
        message: `Email Error: ${mailErr.message || mailErr}`
      });
    }

    res.status(201).json({
      message: 'Registration successful! A verification link has been sent to your email.'
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 2. EMAIL VERIFICATION ENDPOINT
// ==========================================
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is missing.' });
    }

    // Find the user with this token, ensuring the expiration timestamp is in the future ($gt = greater than now)
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'The verification link is invalid or has expired.' });
    }

    // Unlock the account and clear out the temporary token data
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================================
// 3. LOGIN ROUTE (Blocks Unverified Users)
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // GUARD RAIL: Check if the user has verified their email address
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please open your email and click the verification link to activate your account.'
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send back token and user metadata (excluding password)
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
