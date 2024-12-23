const {
  configs: {
    CLIENT: { URL },
  },
} = require('../constants');
// ==============================================================
const {
  registration,
  login,
  verification,
  refresh,
} = require('../services/authService');
// ==============================================================
const { setRefreshTokenCookie } = require('../utils/sharedFunctions');

class AuthController {
  async registration(req, res, next) {
    try {
      const { fullName, email, password } = req.body;
      const authData = await registration(fullName, email, password);
      setRefreshTokenCookie(res, authData.refreshToken);
      res.status(201).json(authData);
    } catch (error) {
      console.error('Registration error: ', error.message);
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const authData = await login(email, password);
      setRefreshTokenCookie(res, authData.refreshToken);
      res.status(200).json(authData);
    } catch (error) {
      console.error('Login error: ', error.message);
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie('refreshToken');
      res.sendStatus(res.statusCode);
    } catch (error) {
      console.error('Logout error: ', error.message);
      next(error);
    }
  }

  async verification(req, res, next) {
    try {
      const verificationLink = req.params.link;
      await verification(verificationLink);
      return res.redirect(`${URL}`);
    } catch (error) {
      console.error('Verification account error: ', error.message);
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const authData = await refresh(refreshToken);
      setRefreshTokenCookie(res, authData.refreshToken);
      res.status(200).json(authData);
    } catch (error) {
      console.error('Refresh error: ', error.message);
      next(error);
    }
  }
}

module.exports = new AuthController();
