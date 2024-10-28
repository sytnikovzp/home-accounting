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

  async saveToken(userId, refreshToken) {
    const data = await Token.findOne({ userId });

    if (data) {
      data.refreshToken = refreshToken;

      return data.save();
    }

    const token = await Token.create({ userId, refreshToken });

    return token;
  }
}

module.exports = new TokenService();
