const { User } = require('../db/dbMongo/models');

const { unAuthorizedError } = require('../errors/authErrors');

const { validateAccessToken } = require('../services/tokenService');

module.exports.authHandler = async (req, res, next) => {
  try {
    const processRequest = async () => {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return next(unAuthorizedError());
      }
      const [, accessToken] = authHeader.split(' ');
      if (!accessToken) {
        return next(unAuthorizedError());
      }
      const userData = validateAccessToken(accessToken);
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
      return { ...userData, uuid: foundUser.uuid };
    };
    req.user = await processRequest();
    return next();
  } catch (error) {
    console.error('Authorization middleware error: ', error.message);
    return next(unAuthorizedError());
  }
};
