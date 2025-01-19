const {
  configs: {
    CLIENT: { URL },
  },
} = require('../constants');
const { checkToken } = require('../utils/sharedFunctions');

const { verifyEmail, resendVerifyEmail } = require('../services/emailService');

class EmailController {
  static async verifyEmail(req, res, next) {
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

  static async resendVerifyEmail(req, res, next) {
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
}

module.exports = EmailController;
