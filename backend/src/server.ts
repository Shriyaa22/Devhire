import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import searchRoutes from './routes/searchRoutes';
import shortlistRoutes from './routes/shortlistRoutes';
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',  // Your React frontend URL
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile',profileRoutes)
app.use('/api/search', searchRoutes);
app.use('/api/shortlist', shortlistRoutes);
// Database connection
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});