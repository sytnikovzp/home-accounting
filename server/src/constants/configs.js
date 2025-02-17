require('dotenv').config({ path: '../.env' });

module.exports = {
  AUTH: {
    ACCESS_SECRET: process.env.ACCESS_SECRET,
    ACCESS_TOKEN_LIFETIME: process.env.ACCESS_TOKEN_LIFETIME,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    REFRESH_TOKEN_LIFETIME: process.env.REFRESH_TOKEN_LIFETIME,
  },
  CLIENT: {
    URL: process.env.CLIENT_URL,
  },
  DATABASE: {
    DB_DIALECT: process.env.DB_DIALECT,
    DB_NAME: process.env.DB_NAME,
    DB_NAME_TEST: process.env.DB_NAME_TEST,
    DB_PASS: process.env.DB_PASS,
    DB_USER: process.env.DB_USER,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    MONGO_DB_NAME_TEST: process.env.MONGO_DB_NAME_TEST,
    MONGO_PORT: process.env.MONGO_PORT,
  },
  FILES: {
    IMAGE_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif'],
    IMAGE_MIMETYPE: /^image\/(jpeg|png|gif)$/,
    MAX_FILE_SIZE: 5 * 1024 * 1024,
  },
  HASH: {
    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS),
  },
  SERVER: {
    HOST: process.env.ACCOUNTING_SERVER_HOST,
    PORT: parseInt(process.env.ACCOUNTING_SERVER_PORT) || 5000,
  },
  SMTP: {
    HOST: process.env.SMTP_HOST,
    PASSWORD: process.env.SMTP_PASSWORD,
    PORT: process.env.SMTP_PORT,
    USER: process.env.SMTP_USER,
  },
  STATIC: {
    PATH: process.env.STATIC_PATH,
  },
  TOKEN_LIFETIME: {
    RESET_PASSWORD: 1 * 60 * 60 * 1000,
    CONFIRMATION: 24 * 60 * 60 * 1000,
  },
};
