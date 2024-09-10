const express = require('express');
const { products } = require('../services/products/index'); 
const { mongo_connection } = require('../helper/mongodb');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8001;

// Initialize routes
const initialize = (app) => {
  app.use('/products', products);
  
  app.use('/authError', (req, res, next) => {
    return next(new Error('DEFAULT_AUTH'));
  });

  app.get('/ping', (req, res) => {
    res.status(200).send({
      success: true,
      statusCode: 200,
      message: 'Server is up and running',
    });
  });
};

mongo_connection()
  .then(() => {
    initialize(app);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });

module.exports = { initialize };