const {
  User,
  Role,
  Permission,
  ConfirmationToken,
} = require('../db/dbMongo/models');

const {
  API_CONFIG: { SERVER_HOST, SERVER_PORT },
  DATA_MAPPING: { EMAIL_CONFIRMATION_MAPPING },
  TOKEN_LIFETIME: { CONFIRMATION_TIME },
} = require('../constants');
const { badRequest, notFound, forbidden } = require('../errors/generalErrors');
const { hashPassword, checkPermission } = require('../utils/authHelpers');
const { formatDateTime } = require('../utils/dateHelpers');
const { mapValue, emailToLowerCase } = require('../utils/stringUtils');
const { isValidUUID } = require('../utils/validators');

const mailService = require('./mailService');
const { generateTokens } = require('./tokenService');

class UsersService {
  static async getAllUsers(emailConfirm, limit, offset, sort, order) {
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sort]: sortOrder };
    const query = {};
    if (emailConfirm === 'confirmed') {
      query.emailConfirm = 'confirmed';
    } else if (emailConfirm === 'pending') {
      query.emailConfirm = 'pending';
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
    const totalCount = await User.countDocuments(query);
    return {
      allUsers,
      totalCount,
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
      emailConfirm: mapValue(
        foundUser.emailConfirm,
        EMAIL_CONFIRMATION_MAPPING
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
    throw forbidden(
      'Ви не маєте дозволу на перегляд профілю цього користувача'
    );
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
      emailConfirm: mapValue(
        foundUser.emailConfirm,
        EMAIL_CONFIRMATION_MAPPING
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

  static async confirmEmail(token) {
    const tokenRecord = await ConfirmationToken.findOne({ token });
    const foundUser = await User.findOne({ uuid: tokenRecord.userUuid });
    if (!foundUser) {
      throw notFound('Користувача не знайдено');
    }
    foundUser.emailConfirm = 'confirmed';
    await foundUser.save();
    await ConfirmationToken.deleteOne({ token });
    return true;
  }

  static async resendConfirmEmail(uuid) {
    const foundUser = await User.findOne({ uuid });
    if (!foundUser) {
      throw notFound('Користувача не знайдено');
    }
    if (foundUser.emailConfirm === 'confirmed') {
      throw badRequest('Цей email вже підтверджений');
    }
    await ConfirmationToken.deleteMany({ userUuid: foundUser.uuid });
    const confirmationToken = await ConfirmationToken.create({
      userUuid: foundUser.uuid,
      expiresAt: new Date(Date.now() + CONFIRMATION_TIME),
    });
    await mailService.sendConfirmationMail(
      foundUser.fullName,
      foundUser.email,
      `http://${SERVER_HOST}:${SERVER_PORT}/api/profile/confirm?token=${confirmationToken.token}`
    );
    return true;
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
    const foundUser = await User.findOne({ uuid });
    if (!foundUser) {
      throw notFound('Користувача не знайдено');
    }
    const canEditUsers =
      currentUser.uuid === uuid ||
      (await checkPermission(currentUser, 'EDIT_USERS'));
    if (!canEditUsers) {
      throw forbidden(
        'Ви не маєте дозволу на оновлення паролю цього користувача'
      );
    }
    if (newPassword !== confirmNewPassword) {
      throw badRequest('Новий пароль та підтвердження пароля не збігаються');
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
      authenticatedUser: {
        uuid: updatedUser.uuid,
        fullName: updatedUser.fullName,
        emailConfirm: mapValue(
          updatedUser.emailConfirm,
          EMAIL_CONFIRMATION_MAPPING
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
    const foundUser = await User.findOne({ uuid });
    if (!foundUser) {
      throw notFound('Користувача не знайдено');
    }
    const canEditUsers =
      currentUser.uuid === uuid ||
      (await checkPermission(currentUser, 'EDIT_USERS'));
    if (!canEditUsers) {
      throw forbidden(
        'Ви не маєте дозволу на оновлення даних цього користувача'
      );
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
          'Ви не маєте дозволу на редагування ролі цього користувача'
        );
      }
      if (foundRole.title === 'Administrators') {
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
    if (
      email &&
      emailToLowerCase(email) !== emailToLowerCase(foundUser.email)
    ) {
      const newEmail = emailToLowerCase(email);
      const existingEmail = await User.findOne({ email: newEmail });
      if (existingEmail) {
        throw badRequest('Ця електронна адреса вже використовується');
      }
      updateData.email = newEmail;
      updateData.emailConfirm = 'pending';
      updateData.tokenVersion = foundUser.tokenVersion + 1;
      const confirmationToken = await ConfirmationToken.create({
        userUuid: foundUser.uuid,
        expiresAt: new Date(Date.now() + CONFIRMATION_TIME),
      });
      await mailService.sendEmailChangeConfirmationMail(
        foundUser.fullName,
        newEmail,
        `http://${SERVER_HOST}:${SERVER_PORT}/api/profile/confirm?token=${confirmationToken.token}`
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
      authenticatedUser: {
        uuid: updatedUser.uuid,
        fullName: updatedUser.fullName,
        emailConfirm: mapValue(
          updatedUser.emailConfirm,
          EMAIL_CONFIRMATION_MAPPING
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
    const foundUser = await User.findOne({ uuid });
    if (!foundUser) {
      throw notFound('Користувача не знайдено');
    }
    const canEditUsers =
      currentUser.uuid === uuid ||
      (await checkPermission(currentUser, 'EDIT_USERS'));
    if (!canEditUsers) {
      throw forbidden(
        'Ви не маєте дозволу на оновлення фотографії цього користувача'
      );
    }
    if (!filename) {
      throw badRequest('Файл не завантажено');
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
    const foundUser = await User.findOne({ uuid });
    if (!foundUser) {
      throw notFound('Користувача не знайдено');
    }
    const canEditUsers =
      currentUser.uuid === uuid ||
      (await checkPermission(currentUser, 'EDIT_USERS'));
    if (!canEditUsers) {
      throw forbidden(
        'Ви не маєте дозволу на видалення фотографії цього користувача'
      );
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
    const foundUser = await User.findOne({ uuid });
    if (!foundUser) {
      throw notFound('Користувача не знайдено');
    }
    const canEditUsers =
      currentUser.uuid === uuid ||
      (await checkPermission(currentUser, 'REMOVE_USERS'));
    if (!canEditUsers) {
      throw forbidden(
        'Ви не маєте дозволу на видалення профілю цього користувача'
      );
    }
    const foundRole = await Role.findOne({ uuid: foundUser.roleUuid });
    if (!foundRole) {
      throw badRequest('Роль для користувача не знайдено');
    }
    if (foundRole.title === 'Administrators') {
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
