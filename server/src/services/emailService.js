const { User, VerificationToken } = require('../db/dbMongo/models');

const {
  configs: {
    SERVER: { HOST, PORT },
    TOKEN_LIFETIME: { VERIFICATION },
  },
} = require('../constants');
const { badRequest, notFound } = require('../errors/generalErrors');
const { emailToLowerCase } = require('../utils/sharedFunctions');

const mailService = require('./mailService');

class EmailService {
  static async verifyEmail(token) {
    const tokenRecord = await VerificationToken.findOne({ token });
    const foundUser = await User.findOne({ uuid: tokenRecord.userUuid });
    if (!foundUser) {
      throw notFound('Користувача не знайдено');
    }
    foundUser.emailVerified = 'verified';
    await foundUser.save();
    await VerificationToken.deleteOne({ token });
  }

  static async resendVerifyEmail(email) {
    const emailToLower = emailToLowerCase(email);
    const foundUser = await User.findOne({ email: emailToLower });
    if (!foundUser) {
      throw notFound('Користувача не знайдено');
    }
    if (foundUser.emailVerified === 'verified') {
      throw badRequest('Цей email вже підтверджений');
    }
    await VerificationToken.deleteMany({ userUuid: foundUser.uuid });
    const verificationToken = await VerificationToken.create({
      expiresAt: new Date(Date.now() + VERIFICATION),
      userUuid: foundUser.uuid,
    });
    await mailService.sendVerificationMail(
      foundUser.email,
      `http://${HOST}:${PORT}/api/email/verify?token=${verificationToken.token}`
    );
  }
}

module.exports = EmailService;
