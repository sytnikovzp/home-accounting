const { Role, User, Permission } = require('../db/dbMongo/models');

const { badRequest, notFound, forbidden } = require('../errors/generalErrors');
const {
  formatDateTime,
  isValidUUID,
  checkPermission,
} = require('../utils/sharedFunctions');

const formatRoleData = (role, permissions = []) => ({
  uuid: role.uuid,
  title: role.title,
  description: role.description || '',
  permissions: permissions.map((permission) => ({
    uuid: permission.uuid,
    title: permission.title,
    description: permission.description,
  })),
  creation: {
    createdAt: formatDateTime(role.createdAt),
    updatedAt: formatDateTime(role.updatedAt),
  },
});

class RolesService {
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
    return formatRoleData(foundRole, permissions);
  }

  static async createRole(
    title,
    descriptionValue,
    permissionsTitles,
    currentUser
  ) {
    if (await Role.findOne({ title })) {
      throw badRequest('Ця роль для користувача вже існує');
    }
    const canAddRoles = await checkPermission(currentUser, 'ADD_ROLES');
    if (!canAddRoles) {
      throw forbidden(
        'Ви не маєте дозволу на додавання ролей для користувачів'
      );
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
    const newRole = new Role({
      title,
      description: descriptionValue || null,
      permissions: foundPermissions.map((permission) => permission.uuid),
    });
    await newRole.save();
    return formatRoleData(newRole, foundPermissions);
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
    const foundRole = await Role.findOne({ uuid });
    if (!foundRole) {
      throw notFound('Роль для користувача не знайдено');
    }
    const canEditRoles = await checkPermission(currentUser, 'EDIT_ROLES');
    if (!canEditRoles) {
      throw forbidden(
        'Ви не маєте дозволу на редагування цієї ролі для користувачів'
      );
    }
    if (foundRole.title === 'Administrators') {
      throw forbidden('Не можна редагувати системну роль Administrators');
    }
    const updateData = {};
    if (title && title !== foundRole.title) {
      if (await Role.findOne({ title })) {
        throw badRequest('Ця роль для користувача вже існує');
      }
      if (foundRole.title === 'Users' && title !== foundRole.title) {
        throw badRequest('Не можна перейменувати системну роль Users');
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
    return formatRoleData(updatedRole, updatedPermissions);
  }

  static async deleteRole(uuid, currentUser) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundRole = await Role.findOne({ uuid });
    if (!foundRole) {
      throw notFound('Роль для користувача не знайдено');
    }
    const canRemoveRoles = await checkPermission(currentUser, 'REMOVE_ROLES');
    if (!canRemoveRoles) {
      throw forbidden(
        'Ви не маєте дозволу на видалення цієї ролі для користувачів'
      );
    }
    if (foundRole.title === 'Users' || foundRole.title === 'Administrators') {
      throw forbidden('Не можна видалити системну роль');
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
