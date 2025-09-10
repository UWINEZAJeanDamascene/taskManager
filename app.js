const express = require('express');
const path = require('path');
const taskRouter = require('./routes/tasks');
const dbConnection = require('./db-connection/connect');
const mongoose = require('mongoose');

// Load env vars locally; on Vercel, use Project Settings -> Environment Variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
}

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Ensure DB connection for each API request (handles cold starts)
let dbInitPromise;
async function ensureDb() {
  if (!dbInitPromise) {
    dbInitPromise = dbConnection(process.env.MONGO_URI);
  }
  return dbInitPromise;
}
app.use(async (req, res, next) => {
  try {
    await ensureDb();
    next();
  } catch (err) {
    next(err);
  }
});

// Root route (serves index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check to debug Vercel connectivity
app.get('/api/v1/health', (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    hasMongoUri: Boolean(process.env.MONGO_URI),
    dbState: mongoose.connection.readyState // 0=disconnected,1=connected,2=connecting,3=disconnecting
  });
});

// API routes
app.use('/api/v1/tasks', taskRouter);

// Basic error handler
app.use((err, req, res, next) => {
  console.error('Request error:', err);
  res.status(500).json({ msg: 'Server error', error: err.message });
});

// Export Express app for Vercel serverless
module.exports = app;