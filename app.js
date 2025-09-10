const express = require('express');
const path = require('path');
const taskRouter = require('./routes/tasks');
const dbConnection = require('./db-connection/connect');

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

// API routes
app.use('/api/v1/tasks', taskRouter);

// Basic error handler
app.use((err, req, res, next) => {
  console.error('Request error:', err);
  res.status(500).json({ msg: 'Server error', error: err.message });
});

// Export Express app for Vercel serverless
module.exports = app;