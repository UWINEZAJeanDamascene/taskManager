const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const app = express();
const taskRouter = require('./routes/tasks');
const dbConnection = require('./db-connection/connect');

// Middleware
app.use(express.static("./public"));
app.use(express.json());

app.use('/api/v1/tasks', taskRouter);

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await dbConnection(process.env.MONGO_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Error connecting to the database', error);
    throw error;
  }
};

// Initialize DB connection
connectDB();

// Export for Vercel
module.exports = app;