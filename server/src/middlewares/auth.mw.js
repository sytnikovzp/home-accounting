const { unAuthorizedError } = require('../errors/authErrors');
const { validateAccessToken } = require('../services/tokenService');

module.exports.authHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(unAuthorizedError());
    }
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return next(unAuthorizedError());
    }
    const data = validateAccessToken(accessToken);
    if (!data) {
      return next(unAuthorizedError());
    }
    req.user = data;
    next();
  } catch (error) {
    console.log(error.message);
    return next(unAuthorizedError());
  }
};
