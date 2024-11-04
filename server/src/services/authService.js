const bcrypt = require('bcrypt');
// ==============================================================
const { User, Role } = require('../db/dbMongo/models');
// ==============================================================
const {
  hashPassword,
  emailToLowerCase,
  formatDate,
  checkPermission,
} = require('../utils/sharedFunctions');
// ==============================================================
const { generateTokens, validateRefreshToken } = require('./tokenService');
// ==============================================================
const { unAuthorizedError } = require('../errors/authErrors');
const { badRequest, notFound, forbidden } = require('../errors/customErrors');

class AuthService {
  async registration(fullName, email, password) {
    const emailToLower = emailToLowerCase(email);
    const person = await User.findOne({ email: emailToLower });
    if (person) throw badRequest('This user already exists');
    const userRole = await Role.findOne({ title: 'User' });
    if (!userRole) throw notFound('User role not found');
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      fullName,
      email: emailToLower,
      password: hashedPassword,
      roleId: userRole._id,
    });
    if (!user) throw badRequest('User is not registered');
    const tokens = generateTokens({ email });
    return {
      ...tokens,
      user: {
        id: user._id,
        fullName: user.fullName,
        role: userRole.title || '',
        photo: user.photo || '',
        email: emailToLower,
      },
    };
  }

  async login(email, password) {
    const emailToLower = emailToLowerCase(email);
    const user = await User.findOne({ email: emailToLower });
    if (!user) throw unAuthorizedError();
    const isPassRight = await bcrypt.compare(password, user.password);
    if (!isPassRight) throw unAuthorizedError();
    const userRole = await Role.findById(user.roleId);
    if (!userRole) throw notFound('User role not found');
    const tokens = generateTokens({ email });
    return {
      ...tokens,
      user: {
        id: user._id,
        fullName: user.fullName,
        role: userRole.title || '',
        photo: user.photo || '',
        email: emailToLower,
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
    const userRole = await Role.findById(user.roleId);
    if (!userRole) throw notFound('User role not found');
    const tokens = generateTokens({ email });
    return {
      ...tokens,
      user: {
        id: user._id,
        fullName: user.fullName,
        role: userRole.title || '',
        photo: user.photo || '',
        email: emailToLower,
      },
    };
  }

  async getAllUsers() {
    const users = await User.find();
    if (users.length === 0) throw notFound('Users not found');
    const usersWithRoles = await Promise.all(
      users.map(async (user) => {
        const role = await Role.findById(user.roleId);
        return {
          id: user._id,
          fullName: user.fullName,
          role: role.title || '',
          photo: user.photo || '',
        };
      })
    );
    return usersWithRoles;
  }

  async getUserById(id, currentUser) {
    const user = await User.findById(id);
    if (!user) throw notFound('User not found');
    const role = await Role.findById(user.roleId);
    const limitUserData = {
      id: user._id,
      fullName: user.fullName,
      role: role.title || '',
      photo: user.photo || '',
    };
    const fullUserData = {
      ...limitUserData,
      email: user.email,
      createdAt: formatDate(user.createdAt),
      updatedAt: formatDate(user.updatedAt),
    };
    const permissions = {
      fullView: 'full_view_of_other_users_profiles',
      limitedView: 'limited_viewing_of_other_user_profiles',
    };

    if (currentUser.id.toString() === id.toString()) {
      return fullUserData;
    }
    if (await checkPermission(currentUser, permissions.fullView)) {
      return fullUserData;
    }
    if (await checkPermission(currentUser, permissions.limitedView)) {
      return limitUserData;
    }
    throw forbidden('Access denied');
  }

  async getUserByEmail(email) {
    const emailToLower = emailToLowerCase(email);
    const user = await User.findOne({ email: emailToLower });
    if (!user) throw notFound('User not found');
    const role = await Role.findById(user.roleId);
    return {
      id: user._id,
      fullName: user.fullName,
      role: role.title || '',
      photo: user.photo || '',
      email: user.email,
      createdAt: formatDate(user.createdAt),
      updatedAt: formatDate(user.updatedAt),
    };
  }

  async updateUser(id, fullName, email, password, role, currentUser) {
    const user = await User.findById(id);
    if (!user) throw notFound('User not found');
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const newEmail = email.toLowerCase();
      const emailExists = await User.findOne({ email: newEmail });
      if (emailExists) throw badRequest('This email is already used');
      updateData.email = newEmail;
    }
    if (password) updateData.password = await hashPassword(password);
    if (role && role !== (await Role.findById(user.roleId)).title) {
      if (currentUser.role !== 'Administrator') {
        throw badRequest('You don`t have permission to change user roles');
      }
      const newRole = await Role.findOne({ title: role });
      if (!newRole) throw notFound('Role not found');
      updateData.roleId = newRole._id;
    }
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedUser) throw badRequest('User is not updated');
    const tokens = generateTokens({ email: updateData.email || user.email });
    return {
      ...tokens,
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        role: role || (await Role.findById(user.roleId)).title,
        email: updateData.email || user.email,
      },
    };
  }

  async updateUserPhoto(id, filename) {
    const user = await User.findById(id);
    if (!user) throw notFound('User not found');
    if (!filename) throw badRequest('No file uploaded');
    user.photo = filename;
    const updatedUser = await user.save();
    return {
      id: updatedUser._id,
      photo: updatedUser.photo || '',
    };
  }

  async removeUserPhoto(id) {
    const user = await User.findById(id);
    if (!user) throw notFound('User not found');
    user.photo = null;
    const updatedUser = await user.save();
    return {
      id: updatedUser._id,
      photo: updatedUser.photo || '',
    };
  }

  async deleteUser(id, currentUser) {
    const user = await User.findById(id);
    if (!user) throw notFound('User not found');
    if (String(currentUser.role) !== String('Administrator'))
      throw badRequest('You don`t have permission to delete users');
    const delUser = await User.findByIdAndDelete(id);
    if (!delUser) throw badRequest('User is not deleted');
    return user;
  }
}

module.exports = new AuthService();
