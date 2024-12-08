const bcrypt = require('bcrypt');
// ==============================================================
const { User, Role } = require('../db/dbMongo/models');
// ==============================================================
const { hashPassword, emailToLowerCase } = require('../utils/sharedFunctions');
// ==============================================================
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
      roleId: foundRole._id,
    });
    if (!user) throw badRequest('Користувач не зареєстрований');
    const tokens = generateTokens({ email });
    return {
      ...tokens,
      user: {
        id: user._id,
        fullName: user.fullName,
        role: foundRole.title || '',
        photo: user.photo || '',
      },
    };
  }

  async login(email, password) {
    const emailToLower = emailToLowerCase(email);
    const user = await User.findOne({ email: emailToLower });
    if (!user) throw unAuthorizedError();
    const isPassRight = await bcrypt.compare(password, user.password);
    if (!isPassRight) throw unAuthorizedError();
    const foundRole = await Role.findById(user.roleId);
    if (!foundRole) throw notFound('Роль для користувача не знайдено');
    const tokens = generateTokens({ email });
    return {
      ...tokens,
      user: {
        id: user._id,
        fullName: user.fullName,
        role: foundRole.title || '',
        photo: user.photo || '',
      },
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw unAuthorizedError();
    const data = validateRefreshToken(refreshToken);
    if (!data) throw unAuthorizedError();
    const { email } = data;
    const emailToLower = emailToLowerCase(email);
    const foundUser = await User.findOne({ email: emailToLower });
    if (!foundUser) throw notFound('Користувача не знайдено');
    const foundRole = await Role.findById(foundUser.roleId);
    if (!foundRole) throw notFound('Роль для користувача не знайдено');
    const tokens = generateTokens({ email });
    return {
      ...tokens,
      user: {
        id: foundUser._id,
        fullName: foundUser.fullName,
        role: foundRole.title || '',
        photo: foundUser.photo || '',
      },
    };
  }
}

module.exports = new AuthService();
