const {
  configs: {
    CLIENT: { URL },
  },
} = require('../constants');
const {
  setRefreshTokenCookie,
  checkToken,
} = require('../utils/sharedFunctions');

const {
  registration,
  login,
  refresh,
  forgotPassword,
  resetPassword,
} = require('../services/authService');

class AuthController {
  static async registration(req, res, next) {
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

  static async login(req, res, next) {
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

  static logout(req, res, next) {
    try {
      res.clearCookie('refreshToken');
      res.status(200).json('OK');
    } catch (error) {
      console.error('Logout error: ', error.message);
      next(error);
    }
  }

  static async refresh(req, res, next) {
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

  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await forgotPassword(email);
      res.status(200).json({
        severity: 'success',
        title: 'Скидання паролю...',
        message:
          'На Вашу електронну адресу відправлено повідомлення з подальшими інструкціями',
      });
    } catch (error) {
      console.error('Password reset error: ', error.message);
      next(error);
    }
  }

  static async getResetPasswordPage(req, res, next) {
    try {
      const { token } = req.query;
      await checkToken(token, 'reset');
      res.redirect(`${URL}/reset-password?token=${token}`);
    } catch (error) {
      console.error('Error while checking reset token: ', error.message);
      res.status(400).json({ message: error.message });
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { token } = req.query;
      await checkToken(token, 'reset');
      const { newPassword, confirmNewPassword } = req.body;
      await resetPassword(token, newPassword, confirmNewPassword);
      res.status(200).json({
        severity: 'success',
        title: 'Скидання паролю...',
        message: 'Ваш пароль успішно змінено',
      });
    } catch (error) {
      console.error('Password reset error: ', error.message);
      next(error);
    }
  }
}

module.exports = AuthController;
