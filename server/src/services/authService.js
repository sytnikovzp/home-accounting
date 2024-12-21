const { v4: uuidv4 } = require('uuid');
// ==============================================================
const {
  configs: {
    SERVER: { HOST, PORT },
  },
} = require('../constants');
// ==============================================================
const { User, Role } = require('../db/dbMongo/models');
// ==============================================================
const {
  hashPassword,
  verifyPassword,
  emailToLowerCase,
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
    const activationLink = uuidv4();
    const user = await User.create({
      fullName,
      email: emailToLower,
      password: hashedPassword,
      activationLink,
      roleUuid: foundRole.uuid,
    });
    if (!user) throw badRequest('Користувач не зареєстрований');
    await mailService.sendActivationMail(
      email,
      `http://${HOST}:${PORT}/api/auth/activate/${activationLink}`
    );
    const tokens = generateTokens(user);
    return {
      ...tokens,
      user: {
        uuid: user.uuid,
        fullName: user.fullName,
        isActivated: user.isActivated,
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
        isActivated: user.isActivated,
        role: foundRole.title || '',
        photo: user.photo || '',
      },
    };
  }

  async activate(activationLink) {
    const user = await User.findOne({ activationLink });
    if (!user)
      throw badRequest('Посилання для активації недійсне або не існує');
    user.isActivated = true;
    await user.save();
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
        isActivated: foundUser.isActivated,
        role: foundRole.title || '',
        photo: foundUser.photo || '',
      },
    };
  }
}

module.exports = new AuthService();
