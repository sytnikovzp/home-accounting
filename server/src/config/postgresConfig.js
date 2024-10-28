const {
  configs: {
    DATABASE: { DB_USER, DB_PASS, DB_NAME, DB_DIALECT },
    SERVER_CONFIG: { HOST },
  },
} = require('../constants');

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: HOST,
    dialect: DB_DIALECT,
    migrationStorage: 'json',
    seederStorage: 'json',
  },
  test: {},
  production: {},
};
