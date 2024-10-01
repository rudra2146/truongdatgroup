const mongoose = require('mongoose');

// MongoDB connection URI (yahan aapka database name daalna na bhoolen)
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/products';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw error; // Rethrow the error for further handling if necessary
  }
};

module.exports = connectDB;
