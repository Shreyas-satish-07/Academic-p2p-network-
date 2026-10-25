import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Reads MONGODB_URI, establishes connection with Mongoose,
 * and logs the host upon successful connection.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MONGODB_URI is not defined in environment variables. Please check your .env configuration.'
    );
  }

  const conn = await mongoose.connect(uri);
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

export default connectDB;
