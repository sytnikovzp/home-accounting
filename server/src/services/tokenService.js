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

  validateAccessToken(token) {
    try {
      const data = jwt.verify(token, ACCESS_SECRET);
      return data;
    } catch (error) {
      console.log('Access token validation error:', error.message);
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const data = jwt.verify(token, REFRESH_SECRET);
      return data;
    } catch (error) {
      console.log('Refresh token validation error:', error.message);
      return null;
    }
  }
}

module.exports = new TokenService();
