import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import adRoutes from './routes/ads.js';

// Load environment variables
dotenv.config();

const app = express();

// Validate required environment variables
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in the .env file');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined in the .env file');
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Connect to MongoDB with retry logic
const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
      });
      console.log('MongoDB connected');
      return;
    } catch (err) {
      console.error(`MongoDB connection attempt ${i + 1} failed:`, err.message);
      if (i === retries - 1) {
        console.error('MongoDB connection failed after all retries. Exiting...');
        process.exit(1);
      }
      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Initiate MongoDB connection
connectWithRetry();

// Mount Routes
app.use('/api/users', authRoutes);
app.use('/api/ads', adRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));