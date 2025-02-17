const { User, ConfirmationToken } = require('../db/dbMongo/models');

const {
  configs: {
    SERVER: { HOST, PORT },
    TOKEN_LIFETIME: { CONFIRMATION },
  },
} = require('../constants');
const { badRequest, notFound } = require('../errors/generalErrors');
const { emailToLowerCase } = require('../utils/sharedFunctions');

const mailService = require('./mailService');

class EmailService {
  static async confirmEmail(token) {
    const tokenRecord = await ConfirmationToken.findOne({ token });
    const foundUser = await User.findOne({ uuid: tokenRecord.userUuid });
    if (!foundUser) {
      throw notFound('Користувача не знайдено');
    }
    foundUser.emailConfirmed = 'confirmed';
    await foundUser.save();
    await ConfirmationToken.deleteOne({ token });
  }

  static async resendConfirmEmail(email) {
    const emailToLower = emailToLowerCase(email);
    const foundUser = await User.findOne({ email: emailToLower });
    if (!foundUser) {
      throw notFound('Користувача не знайдено');
    }
    if (foundUser.emailConfirmed === 'confirmed') {
      throw badRequest('Цей email вже підтверджений');
    }
    await ConfirmationToken.deleteMany({ userUuid: foundUser.uuid });
    const confirmationToken = await ConfirmationToken.create({
      expiresAt: new Date(Date.now() + CONFIRMATION),
      userUuid: foundUser.uuid,
    });
    await mailService.sendConfirmationMail(
      foundUser.email,
      `http://${HOST}:${PORT}/api/email/confirm?token=${confirmationToken.token}`
    );
  }
}

module.exports = EmailService;
