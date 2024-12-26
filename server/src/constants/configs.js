require('dotenv').config({ path: '../.env' });

module.exports = {
  AUTH: {
    ACCESS_SECRET: process.env.ACCESS_SECRET,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    ACCESS_TOKEN_LIFETIME: process.env.ACCESS_TOKEN_LIFETIME,
    REFRESH_TOKEN_LIFETIME: process.env.REFRESH_TOKEN_LIFETIME,
  },
  HASH: {
    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS),
  },
  STATIC: {
    PATH: process.env.STATIC_PATH,
  },
  FILES: {
    IMAGE_MIMETYPE: /^image\/(jpeg|png|gif)$/,
    IMAGE_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif'],
    MAX_FILE_SIZE: 5 * 1024 * 1024,
  },
  CLIENT: {
    URL: process.env.CLIENT_URL,
  },
  SERVER: {
    HOST: process.env.ACCOUNTING_SERVER_HOST,
    PORT: parseInt(process.env.ACCOUNTING_SERVER_PORT) || 5000,
  },
  TOKEN_LIFETIME: {
    VERIFICATION: 24 * 60 * 60 * 1000,
    RESET_PASSWORD: 1 * 60 * 60 * 1000,
  },
  SMTP: {
    HOST: process.env.SMTP_HOST,
    PORT: process.env.SMTP_PORT,
    USER: process.env.SMTP_USER,
    PASSWORD: process.env.SMTP_PASSWORD,
  },
  DATABASE: {
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    DB_NAME_TEST: process.env.DB_NAME_TEST,
    DB_DIALECT: process.env.DB_DIALECT,
    MONGO_PORT: process.env.MONGO_PORT,
    MONGO_DB_NAME: process.env.MONGO_DB_NAME,
    MONGO_DB_NAME_TEST: process.env.MONGO_DB_NAME_TEST,
  },
};
