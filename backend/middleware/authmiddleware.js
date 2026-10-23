// backend/middleware/authmiddleware.js
import '../config/env.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. Server cannot start without it.');
}

export const verifyUser = (req, res, next) => {
  // Grab token from the request header
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No session token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next(); // Pass control to the next controller function
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired session token.' });
  }
};

export const verifyAdmin = (req, res, next) => {
  // Grab token from the request header
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No session token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    
    // Check if the user is an administrator
    if (verified.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied: Administrative privileges required.' });
    }

    req.user = verified;
    next(); // Pass control to the next controller function
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired session token.' });
  }
};