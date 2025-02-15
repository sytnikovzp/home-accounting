const path = require('path');

const mongoose = require('mongoose');

const env = process.env.NODE_ENV || 'development';
const configPath = path.resolve('src', 'config', 'mongoConfig.js');
const config = require(configPath)[env];

const connectMongoDB = async () => {
  try {
    await mongoose.connect(
      `mongodb://${config.host}:${config.port}/${config.dbName}`
    );
    console.log(
      `Connection to MongoDB database <<< ${config.dbName} >>> is done!`
    );
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const closeMongoDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error.message);
  }
};

module.exports = { mongoose, connectMongoDB, closeMongoDB };
