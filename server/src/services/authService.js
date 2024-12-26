const {
  configs: {
    SERVER: { HOST, PORT },
    TOKEN_LIFETIME: { VERIFICATION, RESET_PASSWORD },
  },
  dataMapping: { userVerificationMapping },
} = require('../constants');
// ==============================================================
const {
  User,
  Role,
  VerificationToken,
  PasswordResetToken,
} = require('../db/dbMongo/models');
// ==============================================================
const {
  hashPassword,
  verifyPassword,
  emailToLowerCase,
  mapValue,
} = require('../utils/sharedFunctions');
// ==============================================================
const mailService = require('./mailService');
const { generateTokens, validateRefreshToken } = require('./tokenService');
// ==============================================================
const { unAuthorizedError } = require('../errors/authErrors');
const { badRequest, notFound } = require('../errors/generalErrors');

class AuthService {
  async registration(fullName, email, password) {
    const emailToLower = emailToLowerCase(email);
    const duplicateUser = await User.findOne({ email: emailToLower });
    if (duplicateUser) throw badRequest('Цей користувач вже існує');
    const foundRole = await Role.findOne({ title: 'User' });
    if (!foundRole) throw notFound('Роль для користувача не знайдено');
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      fullName,
      email: emailToLower,
      password: hashedPassword,
      roleUuid: foundRole.uuid,
    });
    if (!user) throw badRequest('Користувач не зареєстрований');
    const verificationToken = await VerificationToken.create({
      userUuid: user.uuid,
      expiresAt: new Date(Date.now() + VERIFICATION),
    });
    await mailService.sendVerificationMail(
      email,
      `http://${HOST}:${PORT}/api/auth/verification?token=${verificationToken.token}`
    );
    const tokens = generateTokens(user);
    return {
      ...tokens,
      user: {
        uuid: user.uuid,
        fullName: user.fullName,
        emailVerificationStatus: mapValue(
          user.emailVerificationStatus,
          userVerificationMapping
        ),
        role: foundRole.title || '',
        photo: user.photo || '',
      },
    };
  }

  async login(email, password) {
    const emailToLower = emailToLowerCase(email);
    const user = await User.findOne({ email: emailToLower });
    if (!user) throw unAuthorizedError();
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) throw unAuthorizedError();
    const foundRole = await Role.findOne({ uuid: user.roleUuid });
    if (!foundRole) throw notFound('Роль для користувача не знайдено');
    const tokens = generateTokens(user);
    return {
      ...tokens,
      user: {
        uuid: user.uuid,
        fullName: user.fullName,
        emailVerificationStatus: mapValue(
          user.emailVerificationStatus,
          userVerificationMapping
        ),
        role: foundRole.title || '',
        photo: user.photo || '',
      },
    };
  }

  async verifyEmail(token) {
    const tokenRecord = await VerificationToken.findOne({ token });
    if (!tokenRecord || tokenRecord.expiresAt < Date.now())
      throw badRequest('Невірний токен, або закінчився термін дії');
    const user = await User.findOne({ uuid: tokenRecord.userUuid });
    if (!user) throw notFound('Користувача не знайдено');
    user.emailVerificationStatus = 'verified';
    await user.save();
    await VerificationToken.deleteOne({ token });
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw unAuthorizedError();
    const data = validateRefreshToken(refreshToken);
    if (!data) throw unAuthorizedError();
    const { email } = data;
    const emailToLower = emailToLowerCase(email);
    const foundUser = await User.findOne({ email: emailToLower });
    if (!foundUser) throw notFound('Користувача не знайдено');
    const foundRole = await Role.findOne({ uuid: foundUser.roleUuid });
    if (!foundRole) throw notFound('Роль для користувача не знайдено');
    const tokens = generateTokens(foundUser);
    return {
      ...tokens,
      user: {
        uuid: foundUser.uuid,
        fullName: foundUser.fullName,
        emailVerificationStatus: mapValue(
          foundUser.emailVerificationStatus,
          userVerificationMapping
        ),
        role: foundRole.title || '',
        photo: foundUser.photo || '',
      },
    };
  }

  async forgotPassword(email) {
    const emailToLower = email.toLowerCase();
    const foundUser = await User.findOne({ email: emailToLower });
    if (!foundUser) throw notFound('Користувача не знайдено');
    await PasswordResetToken.deleteMany({ userUuid: foundUser.uuid });
    const resetToken = await PasswordResetToken.create({
      userUuid: foundUser.uuid,
      expiresAt: new Date(Date.now() + RESET_PASSWORD),
    });
    await mailService.sendResetPasswordEmail(
      foundUser.email,
      `http://${HOST}:${PORT}/api/auth/reset?token=${resetToken.token}`
    );
  }

  async resetPassword(token, newPassword, confirmNewPassword) {
    const resetToken = await PasswordResetToken.findOne({ token });
    if (!resetToken)
      throw badRequest('Невірний токен, або закінчився термін дії');
    if (resetToken.expiresAt < Date.now())
      throw badRequest('Термін дії токену закінчився');
    if (newPassword !== confirmNewPassword)
      throw badRequest('Новий пароль та підтвердження пароля не збігаються');
    const foundUser = await User.findOne({ uuid: resetToken.userUuid });
    if (!foundUser) throw notFound('Користувача не знайдено');
    const hashedNewPassword = await hashPassword(newPassword);
    foundUser.password = hashedNewPassword;
    foundUser.tokenVersion += 1;
    const updatedUser = await foundUser.save();
    if (!updatedUser) throw badRequest('Пароль цього користувача не оновлено');
    await PasswordResetToken.deleteOne({ token });
  }
}

module.exports = new AuthService();
