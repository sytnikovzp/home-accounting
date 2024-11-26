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
    const userData = validateAccessToken(accessToken);
    if (!userData) {
      return next(unAuthorizedError());
    }
    req.user = userData;
    next();
  } catch (error) {
    console.log(error.message);
    return next(unAuthorizedError());
  }
};
