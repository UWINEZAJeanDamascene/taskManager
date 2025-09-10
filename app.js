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

// Root route (serves index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
app.use('/api/v1/tasks', taskRouter);

// Ensure DB connection once (serverless cold start safe)
let dbInitPromise;
async function ensureDb() {
  if (!dbInitPromise) {
    dbInitPromise = dbConnection(process.env.MONGO_URI);
  }
  return dbInitPromise;
}

// Pre-warm connection (non-blocking)
ensureDb().catch((err) => console.error('DB init error:', err));

// Export Express app for Vercel serverless
module.exports = app;