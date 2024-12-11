const { User, Role, Permission } = require('../db/dbMongo/models');
// ==============================================================
const {
  hashPassword,
  emailToLowerCase,
  formatDateTime,
  checkPermission,
} = require('../utils/sharedFunctions');
// ==============================================================
const { generateTokens } = require('./tokenService');
// ==============================================================
const { badRequest, notFound, forbidden } = require('../errors/generalErrors');

class UserService {
  async getAllUsers(limit, offset, sort = '_id', order = 'asc') {
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sort]: sortOrder };
    const foundUsers = await User.find()
      .sort(sortOptions)
      .limit(limit)
      .skip(offset);
    if (foundUsers.length === 0) throw notFound('Користувачів не знайдено');
    const allUsers = await Promise.all(
      foundUsers.map(async (user) => {
        const role = await Role.findById(user.roleId);
        return {
          id: user._id,
          fullName: user.fullName,
          isActivated: user.isActivated,
          role: role ? role.title : '',
          photo: user.photo || '',
        };
      })
    );
    const total = await User.countDocuments();
    return {
      allUsers,
      total,
    };
  }

  async getUserById(id, currentUser) {
    const foundUser = await User.findById(id);
    if (!foundUser) throw notFound('Користувача не знайдено');
    const role = await Role.findById(foundUser.roleId);
    if (!role) throw notFound('Роль для користувача не знайдено');
    const permissions = await Permission.find({
      _id: { $in: role.permissions },
    });
    const limitUserData = {
      id: foundUser._id,
      fullName: foundUser.fullName,
      isActivated: foundUser.isActivated,
      role: role ? role.title : '',
      photo: foundUser.photo || '',
    };
    const fullUserData = {
      ...limitUserData,
      email: foundUser.email,
      createdAt: formatDateTime(foundUser.createdAt),
      updatedAt: formatDateTime(foundUser.updatedAt),
      permissions: permissions.map((permission) => ({
        id: permission._id,
        title: permission.title,
        description: permission.description,
      })),
    };
    if (
      currentUser.id.toString() === id.toString() ||
      (await checkPermission(currentUser, 'FULL_PROFILE_VIEWER'))
    ) {
      return fullUserData;
    }
    if (await checkPermission(currentUser, 'LIMITED_PROFILE_VIEWER')) {
      return limitUserData;
    }
  }

  async getCurrentUser(email) {
    if (!email) throw badRequest('Email відсутній');
    const emailToLower = emailToLowerCase(email);
    const foundUser = await User.findOne({ email: emailToLower });
    if (!foundUser) throw notFound('Користувача не знайдено');
    const role = await Role.findById(foundUser.roleId);
    if (!role) throw notFound('Роль для користувача не знайдено');
    const permissions = await Permission.find({
      _id: { $in: role.permissions },
    });
    return {
      id: foundUser._id,
      fullName: foundUser.fullName,
      isActivated: foundUser.isActivated,
      role: role ? role.title : '',
      photo: foundUser.photo || '',
      email: foundUser.email,
      createdAt: formatDateTime(foundUser.createdAt),
      updatedAt: formatDateTime(foundUser.updatedAt),
      permissions: permissions.map((permission) => ({
        id: permission._id,
        title: permission.title,
        description: permission.description,
      })),
    };
  }

  async updateUser(id, fullName, email, password, role, currentUser) {
    const hasPermission =
      currentUser.id.toString() === id.toString() ||
      (await checkPermission(currentUser, 'MANAGE_USER_PROFILES'));
    if (!hasPermission)
      throw forbidden(
        'У Вас немає дозволу на оновлення даних цього користувача'
      );
    const foundUser = await User.findById(id);
    if (!foundUser) throw notFound('Користувача не знайдено');
    const foundRole = await Role.findById(foundUser.roleId);
    if (!foundRole) throw badRequest('Роль для користувача не знайдено');
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email && email.toLowerCase() !== foundUser.email.toLowerCase()) {
      const newEmail = email.toLowerCase();
      const existingEmail = await User.findOne({ email: newEmail });
      if (existingEmail)
        throw badRequest('Ця електронна адреса вже використовується');
      updateData.email = newEmail;
    }
    if (password) updateData.password = await hashPassword(password);
    if (role && role !== foundRole.title) {
      const hasPermissionToChangeRole = await checkPermission(
        currentUser,
        'ASSIGN_ROLES'
      );
      if (!hasPermissionToChangeRole)
        throw forbidden(
          'У Вас немає дозволу на редагування ролі цього користувача'
        );
      if (foundRole.title === 'Administrator') {
        const adminCount = await User.countDocuments({
          roleId: foundUser.roleId,
        });
        if (adminCount === 1)
          throw forbidden('Неможливо видалити останнього Адміністратора');
      }
      const newRole = await Role.findOne({ title: role });
      if (!newRole) throw notFound('Роль для користувача не знайдено');
      updateData.roleId = newRole._id;
    }
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedUser) throw badRequest('Дані цього користувача не оновлено');
    const tokens = generateTokens({
      email: updateData.email || foundUser.email,
    });
    return {
      ...tokens,
      user: {
        id: updatedUser._id,
        fullName: updatedUser.fullName,
        // isActivated: foundUser.isActivated,
        isActivated: updatedUser.isActivated,
        role: role || (await Role.findById(foundUser.roleId)).title,
      },
    };
  }

  async updateUserPhoto(id, filename, currentUser) {
    const hasPermission =
      currentUser.id.toString() === id.toString() ||
      (await checkPermission(currentUser, 'MANAGE_USER_PROFILES'));
    if (!hasPermission)
      throw forbidden(
        'Ви не маєте дозволу на оновлення фотографії цього користувача'
      );
    if (!filename) throw badRequest('Файл не завантажено');
    const foundUser = await User.findById(id);
    if (!foundUser) throw notFound('Користувача не знайдено');
    foundUser.photo = filename;
    const updatedUser = await foundUser.save();
    return {
      id: updatedUser._id,
      photo: updatedUser.photo || '',
    };
  }

  async removeUserPhoto(id, currentUser) {
    const hasPermission =
      currentUser.id.toString() === id.toString() ||
      (await checkPermission(currentUser, 'MANAGE_USER_PROFILES'));
    if (!hasPermission)
      throw forbidden(
        'Ви не маєте дозволу на видалення фотографії цього користувача'
      );
    const foundUser = await User.findById(id);
    if (!foundUser) throw notFound('Користувача не знайдено');
    foundUser.photo = null;
    const updatedUser = await foundUser.save();
    return {
      id: updatedUser._id,
      photo: updatedUser.photo || '',
    };
  }

  async deleteUser(id, currentUser) {
    const hasPermission =
      currentUser.id.toString() === id.toString() ||
      (await checkPermission(currentUser, 'MANAGE_USER_PROFILES'));
    if (!hasPermission)
      throw forbidden(
        'Ви не маєте дозволу на видалення цього профілю користувача'
      );
    const foundUser = await User.findById(id);
    if (!foundUser) throw notFound('Користувача не знайдено');
    const foundRole = await Role.findById(foundUser.roleId);
    if (!foundRole) throw badRequest('Роль для користувача не знайдено');
    if (foundRole.title === 'Administrator') {
      const adminCount = await User.countDocuments({
        roleId: foundUser.roleId,
      });
      if (adminCount === 1)
        throw forbidden('Неможливо видалити останнього Адміністратора');
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) throw badRequest('Профіль цього користувача не видалено');
    return deletedUser;
  }
}

module.exports = new UserService();
