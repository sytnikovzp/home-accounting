const jwt = require('jsonwebtoken');
// ==============================================================
const {
  configs: {
    AUTH: {
      ACCESS_SECRET,
      REFRESH_SECRET,
      ACCESS_TOKEN_TIME,
      REFRESH_TOKEN_TIME,
    },
  },
} = require('../constants');
// ==============================================================
const { Token } = require('../db/dbMongo/models');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, ACCESS_SECRET, {
      expiresIn: ACCESS_TOKEN_TIME,
    });

    const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_TIME,
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
      const data = jwt.verify(token, ACCESS_SECRET);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const data = jwt.verify(token, REFRESH_SECRET);
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = new TokenService();
