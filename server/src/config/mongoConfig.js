const {
  configs: {
    DATABASE: { MONGO_HOST, MONGO_PORT, MONGO_DB_NAME, MONGO_DB_NAME_TEST },
  },
} = require('../constants');

module.exports = {
  development: {
    dbName: MONGO_DB_NAME,
    host: MONGO_HOST,
    port: MONGO_PORT,
  },
  test: {
    dbName: MONGO_DB_NAME_TEST,
    host: MONGO_HOST,
    port: MONGO_PORT,
  },
};
