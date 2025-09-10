const mongoose = require('mongoose');

let isConnected = false;

const dbConnection = async (uri) => {
  if (isConnected) {
    return;
  }
  
  if (!uri) {
    throw new Error('MongoDB URI is required');
  }

  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

module.exports = dbConnection;