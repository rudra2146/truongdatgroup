// helper/mongodb.js
const mongoose = require('mongoose');

const mongo_connection = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/productsName');
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err; // Ensure the error is thrown to be caught in the index file
  }
};

module.exports = { mongo_connection };
