/* eslint-disable no-unused-vars */
const { ValidationError } = require('yup');
const multer = require('multer');
const {
  Sequelize: { BaseError },
} = require('../db/dbPostgres/models');
// ==============================================================
const AuthError = require('../errors/authErrors');
const GeneralError = require('../errors/generalErrors');

const formatError = (title, message, details = []) => ({
  errors: [{ title, message, details }],
});

module.exports.authErrorHandler = (err, req, res, next) => {
  if (err instanceof AuthError) {
    return res
      .status(err.status)
      .send(
        formatError(
          'Auth Error',
          `Помилка авторизації: ${err.message}`,
          err.errors
        )
      );
  }
  next(err);
};

module.exports.generalErrorHandler = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    return res
      .status(err.status)
      .send(
        formatError('General Error', `Помилка: ${err.message}`, err.errors)
      );
  }
  next(err);
};

module.exports.validationErrorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res
      .status(400)
      .send(
        formatError(
          'Validation Error',
          `Помилка валідації: ${err.message}`,
          err.errors
        )
      );
  }
  next(err);
};

module.exports.sequelizeErrorHandler = (err, req, res, next) => {
  if (err instanceof BaseError) {
    return res
      .status(406)
      .send(
        formatError(
          'Sequelize Error',
          `Помилка операції з базою даних: ${err.message}`,
          err.errors
        )
      );
  }
  next(err);
};

module.exports.uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .send(
        formatError(
          'Multer Error',
          `Помилка завантаження файлу: ${err.message}`,
          err.errors
        )
      );
  }
  next(err);
};

module.exports.errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return;
  }
  res.status(err?.status ?? 500).send({
    errors: [{ title: err?.message ?? 'Internal server error' }],
  });
};
