const bcrypt = require('bcrypt');
// ==============================================================
const { User, Role } = require('../db/dbMongo/models');
// ==============================================================
const {
  configs: {
    HASH: { SALT_ROUNDS },
  },
} = require('../constants');
const { emailToLowerCase } = require('../utils/sharedFunctions');
// ==============================================================
const { generateTokens, validateRefreshToken } = require('./tokenService');
// ==============================================================
const { unAuthorizedError } = require('../errors/authErrors');
const { badRequest, notFound } = require('../errors/customErrors');

async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

class AuthService {
  async registration(fullName, email, password) {
    const emailToLower = emailToLowerCase(email);
    const person = await User.findOne({ email: emailToLower });
    if (person) throw badRequest('This user already exists');
    const customerRole = await Role.findOne({ title: 'Customer' });
    if (!customerRole) throw notFound('Customer role not found');
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      fullName,
      email: emailToLower,
      password: hashedPassword,
      roleId: customerRole._id,
    });
    const tokens = generateTokens({ email });
    return {
      ...tokens,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: emailToLower,
        roleId: user.roleId,
      },
    };
  }

  async login(email, password) {
    const emailToLower = emailToLowerCase(email);
    const user = await User.findOne({ email: emailToLower });

    if (!user) throw unAuthorizedError();
    const isPassRight = await bcrypt.compare(password, user.password);
    if (!isPassRight) throw unAuthorizedError();
    const tokens = generateTokens({ email });
    return {
      ...tokens,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: emailToLower,
        roleId: user.roleId,
      },
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw unAuthorizedError();
    const data = validateRefreshToken(refreshToken);
    if (!data) throw unAuthorizedError();
    const { email } = data;
    const emailToLower = emailToLowerCase(email);
    const user = await User.findOne({ email: emailToLower });
    if (!user) throw notFound('User not found');
    const tokens = generateTokens({ email });
    return {
      ...tokens,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: emailToLower,
        roleId: user.roleId,
      },
    };
  }

  async getAllUsers() {
    const users = await User.find();
    if (users.length === 0) {
      throw notFound('Users not found');
    }
    return users;
  }

  async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw notFound('User not found');
    }
    return user;
  }

  async getUserByEmail(email) {
    const emailToLower = emailToLowerCase(email);
    const user = await User.findOne({ email: emailToLower });
    if (!user) {
      throw notFound('User not found');
    }
    return user;
  }

  async updateUser(id, fullName, email, password, role) {
    const user = await User.findById(id);
    if (!user) {
      throw notFound('User not found');
    }
    const updateData = { fullName };
    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const newEmail = emailToLowerCase(email);
      const person = await User.findOne({ email: newEmail });
      if (person) throw badRequest('This email is already used');
      updateData.email = newEmail;
    }
    if (password) {
      const hashedPassword = await hashPassword(password);
      updateData.password = hashedPassword;
    }
    if (role) {
      const roleDocument = await Role.findOne({ title: role });
      if (!roleDocument) throw notFound('Role not found');
      updateData.roleId = roleDocument._id;
    }
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedUser) {
      throw notFound('User not found');
    }
    return {
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        roleId: updatedUser.roleId,
      },
    };
  }

  async deleteUser(id, currentUser) {
    const adminRole = await Role.findOne({ title: 'Administrator' });
    if (!adminRole) {
      throw notFound('Administrator role is not found');
    }
    if (String(currentUser.roleId) !== String(adminRole._id)) {
      throw badRequest('You don`t have permission to delete users');
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw notFound('User not found');
    }
    return user;
  }
}

module.exports = new AuthService();
