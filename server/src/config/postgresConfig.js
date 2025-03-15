const {
  configs: {
    DATABASE: {
      DB_USER,
      DB_PASS,
      DB_NAME,
      DB_NAME_TEST,
      DB_DIALECT,
      DB_HOST,
      DB_PORT,
    },
  },
} = require('../constants');

module.exports = {
  development: {
    database: DB_NAME,
    dialect: DB_DIALECT,
    host: DB_HOST,
    port: DB_PORT,
    migrationStorage: 'json',
    password: DB_PASS,
    seederStorage: 'json',
    username: DB_USER,
  },
  production: {},
  test: {
    database: DB_NAME_TEST,
    dialect: DB_DIALECT,
    host: DB_HOST,
    port: DB_PORT,
    migrationStorage: 'json',
    password: DB_PASS,
    seederStorage: 'json',
    username: DB_USER,
  },
};
