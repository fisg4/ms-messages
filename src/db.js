/* eslint-disable no-console */
const mongoose = require('mongoose');

const ENV = process.env.NODE_ENV || 'dev';
const MONGODB_URI = process.env.DB_URL || 'mongodb://localhost:27017';
const MONGODB_CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: ENV
};

mongoose.connect(MONGODB_URI, MONGODB_CONFIG);
const db = mongoose.connection;

db.on('connected', () => console.info('✅ Successfully connected to MongoDB'));
db.on('error', (err) => console.error(`⛔ Ups! Something went wrong with MongoDB connection: ${err.message}`));

module.exports = db;
