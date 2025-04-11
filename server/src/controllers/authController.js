const {
  API_CONFIG: { CLIENT_URL },
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
        title: 'Відновлення паролю',
        message:
          'На Вашу електронну адресу відправлено повідомлення з подальшими інструкціями',
      });
    } catch (error) {
      console.error('Request password reset error: ', error.message);
      next(error);
    }
  }

  static async redirectToResetPasswordForm(req, res, next) {
    try {
      const { token } = req.query;
      const isValid = await checkToken(token, 'reset');
      if (isValid) {
        res.redirect(`${CLIENT_URL}/redirect?token=${token}`);
      } else {
        res.redirect(`${CLIENT_URL}/notification?error=expired-token`);
      }
    } catch (error) {
      console.error('Error while checking reset token: ', error.message);
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
        title: 'Відновлення паролю',
        message: 'Ваш пароль успішно змінено',
      });
    } catch (error) {
      res.status(200).json({
        severity: 'error',
        title: 'Сталася помилка',
        message: 'Це посилання вже не дійсне',
      });
      console.error('Password reset error: ', error.message);
      next(error);
    }
  }
}

module.exports = AuthController;
