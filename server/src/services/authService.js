const {
  User,
  Role,
  Permission,
  VerificationToken,
  PasswordResetToken,
} = require('../db/dbMongo/models');

const {
  configs: {
    SERVER: { HOST, PORT },
    TOKEN_LIFETIME: { VERIFICATION, RESET_PASSWORD },
  },
  dataMapping: { USER_VERIFICATION_MAPPING },
} = require('../constants');
const { unAuthorizedError } = require('../errors/authErrors');
const { badRequest, notFound } = require('../errors/generalErrors');
const {
  hashPassword,
  verifyPassword,
  emailToLowerCase,
  mapValue,
} = require('../utils/sharedFunctions');

const mailService = require('./mailService');
const { generateTokens, validateRefreshToken } = require('./tokenService');

class AuthService {
  static async registration(fullName, email, password) {
    const emailToLower = emailToLowerCase(email);
    if (await User.findOne({ email: emailToLower })) {
      throw badRequest('Цей користувач вже зареєстрований');
    }
    const foundRole = await Role.findOne({ title: 'Users' });
    if (!foundRole) {
      throw notFound('Роль для користувача не знайдено');
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      fullName,
      email: emailToLower,
      password: hashedPassword,
      roleUuid: foundRole.uuid,
    });
    if (!user) {
      throw badRequest('Користувач не зареєстрований');
    }
    const verificationToken = await VerificationToken.create({
      userUuid: user.uuid,
      expiresAt: new Date(Date.now() + VERIFICATION),
    });
    await mailService.sendVerificationMail(
      email,
      `http://${HOST}:${PORT}/api/email/verify?token=${verificationToken.token}`
    );
    const permissions = await Permission.find({
      uuid: { $in: foundRole.permissions },
    });
    const tokens = generateTokens(user);
    return {
      ...tokens,
      user: {
        uuid: user.uuid,
        fullName: user.fullName,
        emailVerificationStatus: mapValue(
          user.emailVerificationStatus,
          USER_VERIFICATION_MAPPING
        ),
        role: foundRole.title || '',
        photo: user.photo || '',
      },
      permissions: permissions.map((permission) => permission.title),
    };
  }

  static async login(email, password) {
    const emailToLower = emailToLowerCase(email);
    const foundUser = await User.findOne({ email: emailToLower });
    if (!foundUser) {
      throw unAuthorizedError();
    }
    const isPasswordValid = await verifyPassword(password, foundUser.password);
    if (!isPasswordValid) {
      throw unAuthorizedError();
    }
    const foundRole = await Role.findOne({ uuid: foundUser.roleUuid });
    if (!foundRole) {
      throw notFound('Роль для користувача не знайдено');
    }
    const permissions = await Permission.find({
      uuid: { $in: foundRole.permissions },
    });
    const tokens = generateTokens(foundUser);
    return {
      ...tokens,
      user: {
        uuid: foundUser.uuid,
        fullName: foundUser.fullName,
        emailVerificationStatus: mapValue(
          foundUser.emailVerificationStatus,
          USER_VERIFICATION_MAPPING
        ),
        role: foundRole.title || '',
        photo: foundUser.photo || '',
      },
      permissions: permissions.map((permission) => permission.title),
    };
  }

  static async refresh(refreshToken) {
    if (!refreshToken) {
      throw unAuthorizedError();
    }
    const data = validateRefreshToken(refreshToken);
    if (!data) {
      throw unAuthorizedError();
    }
    const { uuid } = data;
    const foundUser = await User.findOne({ uuid });
    if (!foundUser) {
      throw notFound('Користувача не знайдено');
    }
    const foundRole = await Role.findOne({ uuid: foundUser.roleUuid });
    if (!foundRole) {
      throw notFound('Роль для користувача не знайдено');
    }
    const permissions = await Permission.find({
      uuid: { $in: foundRole.permissions },
    });
    const tokens = generateTokens(foundUser);
    return {
      ...tokens,
      user: {
        uuid: foundUser.uuid,
        fullName: foundUser.fullName,
        emailVerificationStatus: mapValue(
          foundUser.emailVerificationStatus,
          USER_VERIFICATION_MAPPING
        ),
        role: foundRole.title || '',
        photo: foundUser.photo || '',
      },
      permissions: permissions.map((permission) => permission.title),
    };
  }

  static async forgotPassword(email) {
    const emailToLower = email.toLowerCase();
    const foundUser = await User.findOne({ email: emailToLower });
    if (!foundUser) {
      throw notFound('Користувача не знайдено');
    }
    await PasswordResetToken.deleteMany({ userUuid: foundUser.uuid });
    const resetToken = await PasswordResetToken.create({
      userUuid: foundUser.uuid,
      expiresAt: new Date(Date.now() + RESET_PASSWORD),
    });
    await mailService.sendResetPasswordEmail(
      foundUser.email,
      `http://${HOST}:${PORT}/api/auth/reset-password?token=${resetToken.token}`
    );
  }

  static async resetPassword(token, newPassword, confirmNewPassword) {
    const resetToken = await PasswordResetToken.findOne({ token });
    if (newPassword !== confirmNewPassword) {
      throw badRequest('Новий пароль та підтвердження пароля не збігаються');
    }
    const foundUser = await User.findOne({ uuid: resetToken.userUuid });
    if (!foundUser) {
      throw notFound('Користувача не знайдено');
    }
    const hashedNewPassword = await hashPassword(newPassword);
    foundUser.password = hashedNewPassword;
    foundUser.tokenVersion += 1;
    const updatedUser = await foundUser.save();
    if (!updatedUser) {
      throw badRequest('Пароль цього користувача не оновлено');
    }
    await PasswordResetToken.deleteOne({ token });
  }
}

module.exports = AuthService;
