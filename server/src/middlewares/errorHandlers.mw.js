/* eslint-disable no-unused-vars */
const multer = require('multer');
const { ValidationError } = require('yup');

const {
  Sequelize: { BaseError },
} = require('../db/dbPostgres/models');

const {
  configs: {
    FILES: { MAX_FILE_SIZE },
  },
} = require('../constants');
const AuthError = require('../errors/authErrors');
const GeneralError = require('../errors/generalErrors');

const formatError = (title, message) => ({
  severity: 'error',
  title,
  message,
});

module.exports.authErrorHandler = (err, req, res, next) => {
  if (err instanceof AuthError) {
    return res
      .status(err.status)
      .send(formatError('Помилка авторизації', err.message, err.errors));
  }
  return next(err);
};

module.exports.generalErrorHandler = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    return res
      .status(err.status)
      .send(formatError('Сталася помилка', err.message, err.errors));
  }
  return next(err);
};

module.exports.validationErrorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res
      .status(400)
      .send(formatError('Помилка валідації', err.message, err.errors));
  }
  return next(err);
};

module.exports.sequelizeErrorHandler = (err, req, res, next) => {
  if (err instanceof BaseError) {
    return res
      .status(406)
      .send(
        formatError('Помилка операції з базою даних', err.message, err.errors)
      );
  }
  return next(err);
};

module.exports.uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    let errorMessage = err.message;
    if (err.code === 'LIMIT_FILE_SIZE') {
      errorMessage = `Файл занадто великий. Максимальний розмір: ${MAX_FILE_SIZE / 1024 / 1024}MB`;
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      errorMessage = err.message;
    }
    return res
      .status(400)
      .send(
        formatError('Помилка завантаження файлу', errorMessage, err.errors)
      );
  }
  return next(err);
};

module.exports.errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return;
  }
  res.status(err?.status ?? 500).send({
    errors: [{ title: err?.message ?? 'Internal server error' }],
  });
};
