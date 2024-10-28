const jwt = require('jsonwebtoken');
// =====================================
const { Token } = require('../db/dbMongo/models');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: '60d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

module.exports = TokenService;
