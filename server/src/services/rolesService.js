const { Role, User, Permission } = require('../db/dbMongo/models');

const { badRequest, notFound, forbidden } = require('../errors/generalErrors');
const {
  formatDateTime,
  isValidUUID,
  checkPermission,
} = require('../utils/sharedFunctions');

class RolesService {
  static async getAllPermissions() {
    const foundPermissions = await Permission.find().lean();
    if (foundPermissions.length === 0) {
      throw notFound('Права доступу не знайдено');
    }
    const allPermissions = foundPermissions.map(
      ({ uuid, title, description }) => ({
        uuid,
        title,
        description,
      })
    );
    return {
      allPermissions,
    };
  }

  static async getAllRoles(limit, offset, sort, order) {
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sort]: sortOrder };
    const foundRoles = await Role.find()
      .limit(limit)
      .skip(offset)
      .sort(sortOptions)
      .lean();
    if (foundRoles.length === 0) {
      throw notFound('Ролі не знайдено');
    }
    const allRoles = foundRoles.map(({ uuid, title }) => ({
      uuid,
      title,
    }));
    const total = await Role.countDocuments();
    return {
      allRoles,
      total,
    };
  }

  static async getRoleByUuid(uuid) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundRole = await Role.findOne({ uuid });
    if (!foundRole) {
      throw notFound('Роль для користувача не знайдено');
    }
    const permissions = await Permission.find({
      uuid: { $in: foundRole.permissions },
    });
    return {
      uuid: foundRole.uuid,
      title: foundRole.title,
      description: foundRole.description || '',
      permissions: permissions.map((permission) => ({
        uuid: permission.uuid,
        title: permission.title,
        description: permission.description,
      })),
      createdAt: formatDateTime(foundRole.createdAt),
      updatedAt: formatDateTime(foundRole.updatedAt),
    };
  }

  static async createRole(
    title,
    descriptionValue,
    permissionsTitles,
    currentUser
  ) {
    const hasPermission = await checkPermission(currentUser, 'MANAGE_ROLES');
    if (!hasPermission) {
      throw forbidden(
        'Ви не маєте дозволу на створення ролей для користувачів'
      );
    }
    const duplicateRole = await Role.findOne({ title });
    if (duplicateRole) {
      throw badRequest('Ця роль для користувача вже існує');
    }
    const allPermissions = await Permission.find();
    const foundPermissions = allPermissions.filter((permission) =>
      permissionsTitles.includes(permission.title)
    );
    if (foundPermissions.length !== permissionsTitles.length) {
      const missingPermissions = permissionsTitles.filter(
        (title) =>
          !foundPermissions.some((permission) => permission.title === title)
      );
      throw notFound(
        `Не вдалося знайти деякі дозволи: ${missingPermissions.join(', ')}`
      );
    }
    const permissionUUIDs = foundPermissions.map(
      (permission) => permission.uuid
    );
    const description = descriptionValue === '' ? null : descriptionValue;
    const newRole = new Role({
      title,
      description,
      permissions: permissionUUIDs,
    });
    await newRole.save();
    return {
      uuid: newRole.uuid,
      title: newRole.title,
      description: newRole.description || '',
      permissions: foundPermissions.map((permission) => ({
        uuid: permission.uuid,
        title: permission.title,
        description: permission.description,
      })),
    };
  }

  static async updateRole(
    uuid,
    title,
    descriptionValue,
    permissions,
    currentUser
  ) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const hasPermission = await checkPermission(currentUser, 'MANAGE_ROLES');
    if (!hasPermission) {
      throw forbidden(
        'Ви не маєте дозволу на редагування цієї ролі для користувачів'
      );
    }
    const foundRole = await Role.findOne({ uuid });
    if (!foundRole) {
      throw notFound('Роль для користувача не знайдено');
    }
    const updateData = {};
    if (title && title !== foundRole.title) {
      const duplicateRole = await Role.findOne({ title });
      if (duplicateRole) {
        throw badRequest('Ця роль для користувача вже існує');
      }
      updateData.title = title;
    }
    if (descriptionValue) {
      updateData.description =
        descriptionValue === '' ? null : descriptionValue;
    }
    if (permissions) {
      if (permissions.length === 0) {
        updateData.permissions = [];
      } else {
        const foundPermissions = await Permission.find({
          title: { $in: permissions.filter((p) => p !== '') },
        });
        if (
          foundPermissions.length !== permissions.filter((p) => p !== '').length
        ) {
          const missingPermissions = permissions.filter(
            (permission) =>
              !foundPermissions.some((fp) => fp.title === permission)
          );
          throw notFound(
            `Не вдалося знайти деякі дозволи: ${missingPermissions.join(', ')}`
          );
        }
        updateData.permissions = foundPermissions.map(
          (permission) => permission.uuid
        );
      }
    }
    const updatedRole = await Role.findOneAndUpdate({ uuid }, updateData, {
      new: true,
    });
    if (!updatedRole) {
      throw badRequest('Дані цієї ролі для користувача не оновлено');
    }
    const updatedPermissions = await Permission.find({
      uuid: { $in: updatedRole.permissions },
    });
    return {
      uuid: updatedRole.uuid,
      title: updatedRole.title,
      description: updatedRole.description || '',
      permissions: updatedPermissions.map((permission) => ({
        uuid: permission.uuid,
        title: permission.title,
        description: permission.description,
      })),
    };
  }

  static async deleteRole(uuid, currentUser) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const hasPermission = await checkPermission(currentUser, 'MANAGE_ROLES');
    if (!hasPermission) {
      throw forbidden(
        'Ви не маєте дозволу на видалення цієї ролі для користувачів'
      );
    }
    const foundRole = await Role.findOne({ uuid });
    if (!foundRole) {
      throw notFound('Роль для користувача не знайдено');
    }
    const usersWithRole = await User.countDocuments({ roleUuid: uuid });
    if (usersWithRole > 0) {
      throw badRequest(
        `Видалення неможливо, оскільки ${usersWithRole} користувач(ів) використовують цю роль`
      );
    }
    const deletedRole = await Role.findOneAndDelete({ uuid });
    if (!deletedRole) {
      throw badRequest('Дані цієї ролі для користувачів не видалено');
    }
    return deletedRole;
  }
}

module.exports = RolesService;
