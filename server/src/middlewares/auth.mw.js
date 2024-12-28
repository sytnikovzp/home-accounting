const { User } = require('../db/dbMongo/models');
// ==============================================================
const tokenService = require('../services/tokenService');
// ==============================================================
const { unAuthorizedError } = require('../errors/authErrors');

module.exports.authHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(unAuthorizedError());
    }
    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      return next(unAuthorizedError());
    }
    const userData = await tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(unAuthorizedError());
    }
    const foundUser = await User.findOne({ uuid: userData.uuid });
    if (!foundUser) {
      return next(unAuthorizedError('Користувача не знайдено'));
    }
    if (foundUser.tokenVersion !== userData.tokenVersion) {
      return next(unAuthorizedError('Токен доступу більше не дійсний'));
    }
    req.user = userData;
    next();
  } catch (error) {
    console.error('Authorization middleware error:', error.message);
    return next(unAuthorizedError());
  }
};
