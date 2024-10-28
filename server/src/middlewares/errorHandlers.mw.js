/* eslint-disable no-unused-vars */
module.exports.errorHandler = (err, req, res, next) => {
  if (res.headerSent) {
    return;
  }

  const statusCode = err.status || 500;
  const message = err.message || 'Server error';

  res.status(statusCode).send(message);
};
