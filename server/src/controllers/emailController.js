const {
  configs: {
    CLIENT: { URL },
  },
} = require('../constants');
const { checkToken } = require('../utils/sharedFunctions');

const {
  confirmEmail,
  resendConfirmEmail,
} = require('../services/emailService');

class EmailController {
  static async confirmEmail(req, res, next) {
    try {
      const { token } = req.query;
      await checkToken(token, 'confirm');
      await confirmEmail(token);
      res.redirect(
        `${URL}/notification?severity=${encodeURIComponent(
          'success'
        )}&title=${encodeURIComponent(
          'Веріфікація облікового запису...'
        )}&message=${encodeURIComponent('Ваш email успішно підтверджений')}`
      );
    } catch (error) {
      console.error('Confirmation email error: ', error.message);
      next(error);
    }
  }

  static async resendConfirmEmail(req, res, next) {
    try {
      const { email } = req.body;
      await resendConfirmEmail(email);
      res.status(200).json({
        message:
          'На Вашу електронну адресу відправлено повідомлення з подальшими інструкціями',
        severity: 'success',
        title: 'Веріфікація облікового запису...',
      });
    } catch (error) {
      console.error('Resend confirmation email error: ', error.message);
      next(error);
    }
  }
}

module.exports = EmailController;
