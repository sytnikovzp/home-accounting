const jwt = require('jsonwebtoken');
// ====================================================
const { Token } = require('../db/dbMongo/models');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: '20m',
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

  async deleteToken(refreshToken) {
    const data = await Token.deleteOne({ refreshToken });
    return data;
  }

  async findToken(refreshToken) {
    const data = await Token.findOne({ refreshToken });
    return data;
  }

  validateAccessToken(token) {
    try {
      const data = jwt.verify(token, process.env.ACCESS_SECRET);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const data = jwt.verify(token, process.env.REFRESH_SECRET);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = new TokenService();
