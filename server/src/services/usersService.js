const {
  User,
  Role,
  Permission,
  VerificationToken,
} = require('../db/dbMongo/models');

const {
  configs: {
    SERVER: { HOST, PORT },
    TOKEN_LIFETIME: { VERIFICATION },
  },
  dataMapping: { USER_VERIFICATION_MAPPING },
} = require('../constants');
const { badRequest, notFound, forbidden } = require('../errors/generalErrors');
const {
  hashPassword,
  formatDateTime,
  isValidUUID,
  checkPermission,
  mapValue,
} = require('../utils/sharedFunctions');

const mailService = require('./mailService');
const { generateTokens } = require('./tokenService');

class UsersService {
  static async getAllUsers(
    emailVerificationStatus,
    limit,
    offset,
    sort,
    order
  ) {
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sort]: sortOrder };
    const query = {};
    if (emailVerificationStatus === 'verified') {
      query.emailVerificationStatus = 'verified';
    } else if (emailVerificationStatus === 'pending') {
      query.emailVerificationStatus = 'pending';
    }
    const foundUsers = await User.find(query)
      .sort(sortOptions)
      .limit(limit)
      .skip(offset)
      .lean();
    if (foundUsers.length === 0) {
      throw notFound('Користувачів не знайдено');
    }
    const allUsers = foundUsers.map((user) => ({
      uuid: user.uuid,
      fullName: user.fullName,
      photo: user.photo || '',
    }));
    const total = await User.countDocuments(query);
    return {
      allUsers,
      total,
    };
  }

  static async getUserByUuid(uuid, currentUser) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
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
    const limitUserData = {
      uuid: foundUser.uuid,
      fullName: foundUser.fullName,
      role: {
        uuid: foundRole.uuid,
        title: foundRole.title,
      },
      photo: foundUser.photo || '',
      creation: {
        createdAt: formatDateTime(foundUser.createdAt),
        updatedAt: formatDateTime(foundUser.updatedAt),
      },
    };
    const fullUserData = {
      ...limitUserData,
      email: foundUser.email,
      emailVerificationStatus: mapValue(
        foundUser.emailVerificationStatus,
        USER_VERIFICATION_MAPPING
      ),
      permissions: permissions.map((permission) => ({
        uuid: permission.uuid,
        title: permission.title,
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
    throw forbidden('У Вас немає дозволу на перегляд цього профілю');
  }

  static async getCurrentUser(uuid) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
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
    return {
      uuid: foundUser.uuid,
      fullName: foundUser.fullName,
      role: {
        uuid: foundRole.uuid,
        title: foundRole.title,
      },
      photo: foundUser.photo || '',
      email: foundUser.email,
      emailVerificationStatus: mapValue(
        foundUser.emailVerificationStatus,
        USER_VERIFICATION_MAPPING
      ),
      creation: {
        createdAt: formatDateTime(foundUser.createdAt),
        updatedAt: formatDateTime(foundUser.updatedAt),
      },
      permissions: permissions.map((permission) => ({
        uuid: permission.uuid,
        title: permission.title,
      })),
    };
  }

  static async changePassword(
    uuid,
    newPassword,
    confirmNewPassword,
    currentUser
  ) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const hasPermission =
      currentUser.uuid === uuid ||
      (await checkPermission(currentUser, 'MANAGE_USER_PROFILES'));
    if (!hasPermission) {
      throw forbidden(
        'У Вас немає дозволу на оновлення паролю цього користувача'
      );
    }
    if (newPassword !== confirmNewPassword) {
      throw badRequest('Новий пароль та підтвердження пароля не збігаються');
    }
    const foundUser = await User.findOne({ uuid });
    if (!foundUser) {
      throw notFound('Користувача не знайдено');
    }
    const hashedNewPassword = await hashPassword(newPassword);
    foundUser.password = hashedNewPassword;
    foundUser.tokenVersion += 1;
    const updatedUser = await foundUser.save();
    if (!updatedUser) {
      throw badRequest('Дані цього користувача не оновлено');
    }
    const foundRole = await Role.findOne({ uuid: foundUser.roleUuid });
    if (!foundRole) {
      throw notFound('Роль для користувача не знайдено');
    }
    const permissions = await Permission.find({
      uuid: { $in: foundRole.permissions },
    });
    const tokens = generateTokens(updatedUser);
    return {
      ...tokens,
      user: {
        uuid: updatedUser.uuid,
        fullName: updatedUser.fullName,
        emailVerificationStatus: mapValue(
          updatedUser.emailVerificationStatus,
          USER_VERIFICATION_MAPPING
        ),
        role: foundRole.title || '',
        photo: foundUser.photo || '',
      },
      permissions: permissions.map((permission) => permission.title),
    };
  }

  static async updateUser(uuid, fullName, email, role, currentUser) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const hasPermission =
      currentUser.uuid === uuid ||
      (await checkPermission(currentUser, 'MANAGE_USER_PROFILES'));
    if (!hasPermission) {
      throw forbidden(
        'У Вас немає дозволу на оновлення даних цього користувача'
      );
    }
    const foundUser = await User.findOne({ uuid });
    if (!foundUser) {
      throw notFound('Користувача не знайдено');
    }
    const foundRole = await Role.findOne({ uuid: foundUser.roleUuid });
    if (!foundRole) {
      throw badRequest('Роль для користувача не знайдено');
    }
    const updateData = {};
    if (fullName) {
      updateData.fullName = fullName;
    }
    if (role && role !== foundRole.title) {
      const hasPermissionToChangeRole = await checkPermission(
        currentUser,
        'ASSIGN_ROLES'
      );
      if (!hasPermissionToChangeRole) {
        throw forbidden(
          'У Вас немає дозволу на редагування ролі цього користувача'
        );
      }
      if (foundRole.title === 'Administrator') {
        const adminCount = await User.countDocuments({
          roleUuid: foundUser.roleUuid,
        });
        if (adminCount === 1) {
          throw forbidden('Не можна змінити роль останнього Адміністратора');
        }
      }
      const newRole = await Role.findOne({ title: role });
      if (!newRole) {
        throw notFound('Роль для користувача не знайдено');
      }
      updateData.roleUuid = newRole.uuid;
    }
    if (email && email.toLowerCase() !== foundUser.email.toLowerCase()) {
      const newEmail = email.toLowerCase();
      const existingEmail = await User.findOne({ email: newEmail });
      if (existingEmail) {
        throw badRequest('Ця електронна адреса вже використовується');
      }
      updateData.email = newEmail;
      updateData.emailVerificationStatus = 'pending';
      updateData.tokenVersion = foundUser.tokenVersion + 1;
      const verificationToken = await VerificationToken.create({
        userUuid: foundUser.uuid,
        expiresAt: new Date(Date.now() + VERIFICATION),
      });
      await mailService.sendEmailChangeVerification(
        newEmail,
        `http://${HOST}:${PORT}/api/email/verify?token=${verificationToken.token}`
      );
    }
    const updatedUser = await User.findOneAndUpdate({ uuid }, updateData, {
      new: true,
    });
    if (!updatedUser) {
      throw badRequest('Дані цього користувача не оновлено');
    }
    const permissions = await Permission.find({
      uuid: { $in: foundRole.permissions },
    });
    const tokens = generateTokens(updatedUser);
    return {
      ...tokens,
      user: {
        uuid: updatedUser.uuid,
        fullName: updatedUser.fullName,
        emailVerificationStatus: mapValue(
          updatedUser.emailVerificationStatus,
          USER_VERIFICATION_MAPPING
        ),
        role: role || (await Role.findOne({ uuid: foundUser.roleUuid })).title,
        photo: foundUser.photo || '',
      },
      permissions: permissions.map((permission) => permission.title),
    };
  }

  static async changeUserPhoto(uuid, filename, currentUser) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const hasPermission =
      currentUser.uuid === uuid ||
      (await checkPermission(currentUser, 'MANAGE_USER_PROFILES'));
    if (!hasPermission) {
      throw forbidden(
        'Ви не маєте дозволу на оновлення фотографії цього користувача'
      );
    }
    if (!filename) {
      throw badRequest('Файл не завантажено');
    }
    const foundUser = await User.findOne({ uuid });
    if (!foundUser) {
      throw notFound('Користувача не знайдено');
    }
    foundUser.photo = filename;
    const updatedUser = await foundUser.save();
    return {
      uuid: updatedUser.uuid,
      photo: updatedUser.photo || '',
    };
  }

  static async resetUserPhoto(uuid, currentUser) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const hasPermission =
      currentUser.uuid === uuid ||
      (await checkPermission(currentUser, 'MANAGE_USER_PROFILES'));
    if (!hasPermission) {
      throw forbidden(
        'Ви не маєте дозволу на видалення фотографії цього користувача'
      );
    }
    const foundUser = await User.findOne({ uuid });
    if (!foundUser) {
      throw notFound('Користувача не знайдено');
    }
    foundUser.photo = null;
    const updatedUser = await foundUser.save();
    return {
      uuid: updatedUser.uuid,
      photo: updatedUser.photo || '',
    };
  }

  static async deleteUser(uuid, currentUser) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const hasPermission =
      currentUser.uuid === uuid ||
      (await checkPermission(currentUser, 'MANAGE_USER_PROFILES'));
    if (!hasPermission) {
      throw forbidden(
        'Ви не маєте дозволу на видалення цього профілю користувача'
      );
    }
    const foundUser = await User.findOne({ uuid });
    if (!foundUser) {
      throw notFound('Користувача не знайдено');
    }
    const foundRole = await Role.findOne({ uuid: foundUser.roleUuid });
    if (!foundRole) {
      throw badRequest('Роль для користувача не знайдено');
    }
    if (foundRole.title === 'Administrator') {
      const adminCount = await User.countDocuments({
        roleUuid: foundUser.roleUuid,
      });
      if (adminCount === 1) {
        throw forbidden('Не можна видалити останнього Адміністратора');
      }
    }
    const deletedUser = await User.findOneAndDelete({ uuid });
    if (!deletedUser) {
      throw badRequest('Профіль цього користувача не видалено');
    }
    return deletedUser;
  }
}

module.exports = UsersService;
