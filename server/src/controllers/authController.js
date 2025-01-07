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
  verifyEmail,
  resendVerifyEmail,
  forgotPassword,
  resetPassword,
} = require('../services/authService');

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

  async verifyEmail(req, res, next) {
    try {
      const { token } = req.query;
      await checkToken(token, 'verify');
      await verifyEmail(token);
      res.redirect(
        `${URL}/notification?severity=${encodeURIComponent(
          'success'
        )}&title=${encodeURIComponent(
          'Веріфікація облікового запису...'
        )}&message=${encodeURIComponent('Ваш email успішно підтверджений')}`
      );
    } catch (error) {
      console.error('Verification email error: ', error.message);
      next(error);
    }
  }

  async resendVerifyEmail(req, res, next) {
    try {
      const { email } = req.body;
      await resendVerifyEmail(email);
      res.status(200).json({
        severity: 'success',
        title: 'Веріфікація облікового запису...',
        message:
          'На Вашу електронну адресу відправлено повідомлення з подальшими інструкціями',
      });
    } catch (error) {
      console.error('Resend verification email error: ', error.message);
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await forgotPassword(email);
      res.status(200).json({
        severity: 'success',
        title: 'Зміна паролю...',
        message:
          'На Вашу електронну адресу відправлено повідомлення з подальшими інструкціями',
      });
    } catch (error) {
      console.error('Password reset error: ', error.message);
      next(error);
    }
  }

  async getResetPasswordPage(req, res, next) {
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

  async resetPassword(req, res, next) {
    try {
      const { token } = req.query;
      await checkToken(token, 'reset');
      const { newPassword, confirmNewPassword } = req.body;
      await resetPassword(token, newPassword, confirmNewPassword);
      res.status(200).json({
        severity: 'success',
        title: 'Зміна паролю...',
        message: 'Ваш пароль успішно змінено',
      });
    } catch (error) {
      console.error('Password reset error: ', error.message);
      next(error);
    }
  }
}

module.exports = new AuthController();
