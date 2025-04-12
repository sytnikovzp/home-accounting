const { User } = require('../db/dbMongo/models');

const { unAuthorizedError } = require('../errors/authErrors');

const tokenService = require('../services/tokenService');

module.exports.authHandler = async (req, res, next) => {
  try {
    const processRequest = async () => {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw unAuthorizedError();
      }
      const [, accessToken] = authHeader.split(' ');
      if (!accessToken) {
        throw unAuthorizedError();
      }
      const userData = await tokenService.validateAccessToken(accessToken);
      if (!userData) {
        throw unAuthorizedError();
      }
      const foundUser = await User.findOne({ uuid: userData.uuid });
      if (!foundUser) {
        throw unAuthorizedError('Користувача не знайдено');
      }
      if (foundUser.tokenVersion !== userData.tokenVersion) {
        throw unAuthorizedError('Токен доступу більше не дійсний');
      }
      return { ...userData, uuid: foundUser.uuid };
    };
    req.user = await processRequest();
    return next();
  } catch (error) {
    console.error('Authorization middleware error: ', error.message);
    return next(unAuthorizedError());
  }
};
