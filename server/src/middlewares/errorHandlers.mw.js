/* eslint-disable no-unused-vars */
const { ValidationError } = require('yup');
const {
  Sequelize: { BaseError },
} = require('../db/dbPostgres/models');
// ====================================================
const AuthError = require('../errors/authError');

module.exports.authErrorHandler = (err, req, res, next) => {
  if (err instanceof AuthError) {
    return res.status(err.status).send({
      errors: [
        { title: 'Auth Error', message: err.message, details: err.errors },
      ],
    });
  }

  next(err);
};

module.exports.validationErrorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).send({
      errors: [{ title: 'Validation Error', details: err.errors }],
    });
  }

  next(err);
};

module.exports.sequelizeErrorHandler = (err, req, res, next) => {
  if (err instanceof BaseError) {
    return res.status(406).send({
      errors: [{ title: 'Sequelize Error', details: err.errors }],
    });
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
