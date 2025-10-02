// Load environment variables (from .env file)
import 'dotenv/config';

// Import libraries
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

//import authRoutes brings in the routes we wrote in auth.js.
import authRoutes from './routes/auth.js';


// Create an Express app
const app = express();

// Middlewares (helpers that process requests before they reach your routes)
app.use(cors());              // allows frontend (React) to talk to backend
app.use(express.json());      // lets server understand JSON request bodies
app.use(morgan('dev'));       // logs requests in terminal for debugging

//app.use('/api/auth', authRoutes) mounts them under /api/auth.
app.use('/api/auth', authRoutes);


// Simple route to test if server is working
app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'healthy' });
});

// Get PORT and DB URL from environment variables
const { PORT = 5000, MONGODB_URI } = process.env;

// Connect to MongoDB and start server
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB connection error:', err);
  });
