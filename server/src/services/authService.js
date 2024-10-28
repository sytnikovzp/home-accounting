const bcrypt = require('bcrypt');
// ====================================================
const { User, Role } = require('../db/dbMongo/models');
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

    const customerRole = await Role.findOne({ title: 'Customer' });
    if (!customerRole) throw new Error('Customer role not found');

    const user = await User.create({
      fullName,
      email,
      password,
      roleId: customerRole._id,
    });

    return {
      user: {
        id: user._id,
        email: user.email,
        roleId: user.roleId,
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
    const adminRole = await Role.findOne({ title: 'Administrator' });

    if (!adminRole) {
      throw new Error('Administrator role is not found');
    }

    if (String(user.roleId) === String(adminRole._id)) {
      const delUser = await User.deleteOne({ email });
      return delUser;
    }

    return null;
  }
}

module.exports = new AuthService();
