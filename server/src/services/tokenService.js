const jwt = require('jsonwebtoken');

const {
  AUTH_CONFIG: {
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_LIFETIME,
    REFRESH_TOKEN_LIFETIME,
  },
} = require('../constants');

class TokenService {
  static generateTokens(user) {
    const payload = {
      tokenVersion: user.tokenVersion,
      uuid: user.uuid,
    };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_LIFETIME,
    });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_LIFETIME,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  static validateAccessToken(token) {
    try {
      const payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
      return payload;
    } catch (error) {
      console.error('Access token validation error: ', error.message);
      return null;
    }
  }

  static validateRefreshToken(token) {
    try {
      const payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
      return payload;
    } catch (error) {
      console.error('Refresh token validation error: ', error.message);
      return null;
    }
  }
}

module.exports = TokenService;
