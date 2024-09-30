const express = require('express');
const path = require('path');
const productsRoutes = require('../services/products/index'); // Adjusted to match the filename
const homeRoutes = require('../services/home/home.routes');
// const registerRoutes = require('../services/register/register.routes');
const userRoutes = require('../services/user/index');
const connectDB = require('../helper/mongodb');  // Import the function directly
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const initialize = (app) => {
  // Define routes
  app.use('/products', productsRoutes);
  app.use('/uploads', express.static(path.join(__dirname, '..','..', 'public', 'uploads')));
  app.use('/home', homeRoutes);
  // app.use('/register', registerRoutes);
  app.use('/users', userRoutes);

  // Error handling route
  app.use('/authError', (req, res, next) => {
    return next(new Error('DEFAULT_AUTH'));
  });
};

// connectDB()
//   .then(() => {
//     initialize(app);
//     app.listen( () => {
//       console.log(`Server is running on port`);
//     });
//   })
//   .catch(err => {
//     console.error('Failed to connect to MongoDB', err);
//   });

module.exports = { initialize };
