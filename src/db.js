const mongoose = require('mongoose');

const ENV = process.env.NODE_ENV || 'dev';
const MONGODB_URI = process.env.DB_URL;
const MONGODB_CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: ENV
};

mongoose.connect(MONGODB_URI, MONGODB_CONFIG)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error(`⛔ Ups! Something went wrong with MongoDB connection: ${err.message}`);
    process.exit(1);
  });
