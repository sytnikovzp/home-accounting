const bcrypt = require('bcrypt');
// ====================================================
const { User } = require('../db/dbMongo/models');
// ====================================================
const {
  generateTokens,
  saveToken,
  deleteToken,
  validateRefreshToken,
  findToken,
} = require('./tokenService');
const { badRequest, unAuthorizedError } = require('../errors/authError');

class AuthService {
  async registration(fullName, email, password) {
    const person = await User.findOne({ email });

    if (person) throw badRequest('This user already exists');

    const user = await User.create({ fullName, email, password });

    const userId = user._id;

    return {
      user: {
        id: userId,
        password,
        email,
      },
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email });

    if (!user) throw unAuthorizedError();

    const isPassRight = await bcrypt.compare(password, user.password);

    if (!isPassRight) throw unAuthorizedError();

    const tokens = generateTokens({ email });

    const userId = user._id;

    await saveToken(userId, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: userId,
        email,
      },
    };
  }

  async logout(refreshToken) {
    const token = await deleteToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw unAuthorizedError();

    const data = validateRefreshToken(refreshToken);

    const dbToken = await findToken(refreshToken);

    if (!data || !dbToken) throw unAuthorizedError();

    const { email } = data;

    const user = await User.findOne({ email });

    const userId = user._id;

    const tokens = generateTokens({ email });

    await saveToken(userId, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: userId,
        email,
      },
    };
  }

  async getAllUsers() {
    const users = await User.find();
    return users;
  }

  async deleteUser(email) {
    const user = await User.findOne({ email });

    if (user.roleId === '66f9899ade997160c3666ed4') {
      const delUser = await User.deleteOne({ email });
      return delUser;
    }

    return null;
  }
}

module.exports = new AuthService();
