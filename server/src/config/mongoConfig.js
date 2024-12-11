const {
  configs: {
    DATABASE: { MONGO_PORT, MONGO_DB_NAME, MONGO_DB_NAME_TEST },
    SERVER: { HOST },
  },
} = require('../constants');

module.exports = {
  development: {
    host: HOST,
    port: MONGO_PORT,
    dbName: MONGO_DB_NAME,
  },
  test: {
    host: HOST,
    port: MONGO_PORT,
    dbName: MONGO_DB_NAME_TEST,
  },
};
