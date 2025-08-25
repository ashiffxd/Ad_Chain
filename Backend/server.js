import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import adRoutes from './routes/ads.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'https://ad-chain-coral.vercel.app/', 
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow mobile/postman
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Test route
app.get('/', (req, res) => {
  res.send('AdChain backend server is running ✅');
});

// Your actual API routes
app.use('/api/users', authRoutes);
app.use('/api/ads', adRoutes);

// Start server
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ Connected to MongoDB`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
