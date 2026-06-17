// backend/config/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`🍃 MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1); // Stop the server entirely if the database connection fails
  }
};

export default connectDB;