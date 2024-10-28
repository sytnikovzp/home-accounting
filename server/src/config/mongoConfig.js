const {
  configs: {
    DATABASE: { MONGO_PORT, MONGO_DB_NAME },
    SERVER_CONFIG: { HOST },
  },
} = require('../constants');

module.exports = {
  development: {
    host: HOST,
    port: MONGO_PORT,
    dbName: MONGO_DB_NAME,
  },
};
