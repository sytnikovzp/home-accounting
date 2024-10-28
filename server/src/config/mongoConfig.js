require('dotenv').config();

module.exports = {
  development: {
    host: process.env.HOST,
    port: process.env.MONGO_PORT,
    dbName: process.env.MONGO_DB_NAME,
  },
};
