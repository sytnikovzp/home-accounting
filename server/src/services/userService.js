const { User, Role, Permission } = require('../db/dbMongo/models');
// ==============================================================
const {
  dataMapping: { titleRolesMapping },
} = require('../constants');
// ==============================================================
const {
  hashPassword,
  emailToLowerCase,
  formatDateTime,
  isValidUUID,
  checkPermission,
  mapValue,
} = require('../utils/sharedFunctions');
// ==============================================================
const { generateTokens } = require('./tokenService');
// ==============================================================
const { badRequest, notFound, forbidden } = require('../errors/generalErrors');
const { roleTitleMapping } = require('../constants/dataMapping');

class UserService {
  async getAllUsers(isActivated, limit, offset, sort, order) {
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sort]: sortOrder };
    const query =
      isActivated !== undefined ? { isActivated: isActivated === 'true' } : {};
    const foundUsers = await User.find(query)
      .sort(sortOptions)
      .limit(limit)
      .skip(offset)
      .lean();
    if (foundUsers.length === 0) throw notFound('Користувачів не знайдено');
    const allUsers = await Promise.all(
      foundUsers.map(async (user) => {
        return {
          uuid: user.uuid,
          fullName: user.fullName,
          photo: user.photo || '',
        };
      })
    );
    const total = await User.countDocuments(query);
    return {
      allUsers,
      total,
    };
  }

  async getUserByUuid(uuid, currentUser) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const foundUser = await User.findOne({ uuid });
    if (!foundUser) throw notFound('Користувача не знайдено');
    const roleUuidBinary = foundUser.roleUuid;
    const role = await Role.findOne({ uuid: roleUuidBinary });
    if (!role) throw notFound('Роль для користувача не знайдено');
    const translatedRoleTitle = mapValue(role.title, titleRolesMapping);
    const permissions = await Permission.find({
      uuid: { $in: role.permissions },
    });
    const limitUserData = {
      uuid: foundUser.uuid,
      fullName: foundUser.fullName,
      role: {
        uuid: role.uuid,
        title: translatedRoleTitle,
      },
      photo: foundUser.photo || '',
    };
    const fullUserData = {
      ...limitUserData,
      email: foundUser.email,
      isActivated: foundUser.isActivated,
      creation: {
        createdAt: formatDateTime(foundUser.createdAt),
        updatedAt: formatDateTime(foundUser.updatedAt),
      },
      permissions: permissions.map((permission) => ({
        uuid: permission.uuid,
        title: permission.title,
        description: permission.description,
      })),
    };
    if (
      currentUser.uuid.toString() === uuid.toString() ||
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
    const role = await Role.findOne({ uuid: foundUser.roleUuid });
    if (!role) throw notFound('Роль для користувача не знайдено');
    const translatedRoleTitle = mapValue(role.title, titleRolesMapping);
    const permissions = await Permission.find({
      uuid: { $in: role.permissions },
    });
    return {
      uuid: foundUser.uuid,
      fullName: foundUser.fullName,
      role: {
        uuid: role.uuid,
        title: translatedRoleTitle,
      },
      photo: foundUser.photo || '',
      email: foundUser.email,
      isActivated: foundUser.isActivated,
      creation: {
        createdAt: formatDateTime(foundUser.createdAt),
        updatedAt: formatDateTime(foundUser.updatedAt),
      },
      permissions: permissions.map((permission) => ({
        uuid: permission.uuid,
        title: permission.title,
        description: permission.description,
      })),
    };
  }

  async updateUser(uuid, fullName, email, password, role, currentUser) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const hasPermission =
      currentUser.uuid === uuid ||
      (await checkPermission(currentUser, 'MANAGE_USER_PROFILES'));
    if (!hasPermission)
      throw forbidden(
        'У Вас немає дозволу на оновлення даних цього користувача'
      );
    const foundUser = await User.findOne({ uuid });
    if (!foundUser) throw notFound('Користувача не знайдено');
    const foundRole = await Role.findOne({ uuid: foundUser.roleUuid });
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
          roleUuid: foundUser.roleUuid,
        });
        if (adminCount === 1)
          throw forbidden('Неможливо видалити останнього Адміністратора');
      }
      const internalRoleTitle = roleTitleMapping[role];
      const newRole = await Role.findOne({ title: internalRoleTitle });
      if (!newRole) throw notFound('Роль для користувача не знайдено');
      updateData.roleUuid = newRole.uuid;
    }
    const updatedUser = await User.findOneAndUpdate({ uuid }, updateData, {
      new: true,
    });
    if (!updatedUser) throw badRequest('Дані цього користувача не оновлено');
    const tokens = generateTokens({
      email: updateData.email || foundUser.email,
    });
    return {
      ...tokens,
      user: {
        uuid: updatedUser.uuid,
        fullName: updatedUser.fullName,
        isActivated: updatedUser.isActivated,
        role: role || (await Role.findOne({ uuid: foundUser.roleUuid })).title,
      },
    };
  }

  async updateUserPhoto(uuid, filename, currentUser) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const hasPermission =
      currentUser.uuid === uuid ||
      (await checkPermission(currentUser, 'MANAGE_USER_PROFILES'));
    if (!hasPermission)
      throw forbidden(
        'Ви не маєте дозволу на оновлення фотографії цього користувача'
      );
    if (!filename) throw badRequest('Файл не завантажено');
    const foundUser = await User.findOne({ uuid });
    if (!foundUser) throw notFound('Користувача не знайдено');
    foundUser.photo = filename;
    const updatedUser = await foundUser.save();
    return {
      uuid: updatedUser.uuid,
      photo: updatedUser.photo || '',
    };
  }

  async removeUserPhoto(uuid, currentUser) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const hasPermission =
      currentUser.uuid === uuid ||
      (await checkPermission(currentUser, 'MANAGE_USER_PROFILES'));
    if (!hasPermission)
      throw forbidden(
        'Ви не маєте дозволу на видалення фотографії цього користувача'
      );
    const foundUser = await User.findOne({ uuid });
    if (!foundUser) throw notFound('Користувача не знайдено');
    foundUser.photo = null;
    const updatedUser = await foundUser.save();
    return {
      uuid: updatedUser.uuid,
      photo: updatedUser.photo || '',
    };
  }

  async deleteUser(uuid, currentUser) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const hasPermission =
      currentUser.uuid === uuid ||
      (await checkPermission(currentUser, 'MANAGE_USER_PROFILES'));
    if (!hasPermission)
      throw forbidden(
        'Ви не маєте дозволу на видалення цього профілю користувача'
      );
    const foundUser = await User.findOne({ uuid });
    if (!foundUser) throw notFound('Користувача не знайдено');
    const foundRole = await Role.findOne({ uuid: foundUser.roleUuid });
    if (!foundRole) throw badRequest('Роль для користувача не знайдено');
    if (foundRole.title === 'Administrator') {
      const adminCount = await User.countDocuments({
        roleUuid: foundUser.roleUuid,
      });
      if (adminCount === 1)
        throw forbidden('Неможливо видалити останнього Адміністратора');
    }
    const deletedUser = await User.findOneAndDelete({ uuid });
    if (!deletedUser) throw badRequest('Профіль цього користувача не видалено');
    return deletedUser;
  }
}

module.exports = new UserService();
