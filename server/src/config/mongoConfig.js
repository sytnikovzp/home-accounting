const {
  configs: {
    DATABASE: { MONGO_PORT, MONGO_DB_NAME, MONGO_DB_NAME_TEST },
    SERVER: { HOST },
  },
} = require('../constants');

module.exports = {
  development: {
    dbName: MONGO_DB_NAME,
    host: HOST,
    port: MONGO_PORT,
  },
  test: {
    dbName: MONGO_DB_NAME_TEST,
    host: HOST,
    port: MONGO_PORT,
  },
};
