const { Role, User, Permission } = require('../db/dbMongo/models');
// ==============================================================
const { formatDate, checkPermission } = require('../utils/sharedFunctions');
// ==============================================================
const { badRequest, notFound, forbidden } = require('../errors/customErrors');

class RoleService {
  async getAllPermissions(limit, offset) {
    const findPermissions = await Permission.find()
      .limit(limit)
      .skip(offset)
      .lean();
    if (findPermissions.length === 0) throw notFound('Permissions not found');
    const allPermissions = findPermissions.map(({ _id, ...permission }) => ({
      id: _id,
      ...permission,
    }));
    const total = await Permission.countDocuments();
    return {
      allPermissions,
      total,
    };
  }

  async getAllRoles() {
    const findRoles = await Role.find().populate('permissions').lean();
    if (findRoles.length === 0) throw notFound('Roles not found');
    return findRoles.map(({ _id, title, description, permissions }) => ({
      id: _id,
      title,
      description: description || '',
      permissions: permissions.map(({ _id, title }) => ({
        id: _id,
        title,
      })),
    }));
  }

  async getRoleById(id) {
    const findRole = await Role.findById(id).populate('permissions');
    if (!findRole) throw notFound('Role not found');
    return {
      id: findRole._id,
      title: findRole.title,
      description: findRole.description || '',
      permissions: findRole.permissions.map(({ _id, title, description }) => ({
        id: _id,
        title,
        description,
      })),
      createdAt: formatDate(findRole.createdAt),
      updatedAt: formatDate(findRole.updatedAt),
    };
  }

  async createRole(title, descriptionValue, permissions, currentUser) {
    const hasPermission = await checkPermission(currentUser, 'CREATE_ROLES');
    if (!hasPermission)
      throw forbidden('You don`t have permission to create roles for users');
    const duplicateRole = await Role.findOne({ title });
    if (duplicateRole) throw badRequest('This role already exists');
    const foundPermissions = await Permission.find({
      title: { $in: permissions },
    });
    if (foundPermissions.length !== permissions.length) {
      const missingPermissions = permissions.filter(
        (permission) => !foundPermissions.some((fp) => fp.title === permission)
      );
      throw notFound(
        `Some permissions were not found: ${missingPermissions.join(', ')}`
      );
    }
    const description = descriptionValue === '' ? null : descriptionValue;
    const newRole = new Role({
      title,
      description,
      permissions: foundPermissions.map((permission) => permission._id),
    });
    await newRole.save();
    return {
      id: newRole._id,
      title: newRole.title,
      description: newRole.description || '',
      permissions: foundPermissions.map((permission) => ({
        id: permission._id,
        title: permission.title,
        description: permission.description,
      })),
    };
  }

  async updateRole(id, title, descriptionValue, permissions, currentUser) {
    const hasPermission = await checkPermission(currentUser, 'EDIT_ROLES');
    if (!hasPermission)
      throw forbidden('You don`t have permission to edit roles for users');
    const findRole = await Role.findById(id);
    if (!findRole) throw notFound('Role not found');
    if (title && title !== findRole.title) {
      const duplicateRole = await Role.findOne({ title });
      if (duplicateRole) throw badRequest('This role already exists');
    }
    let foundPermissions = findRole.permissions;
    if (permissions && permissions.length > 0) {
      foundPermissions = await Permission.find({
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
          `Some permissions were not found: ${missingPermissions.join(', ')}`
        );
      }
    }
    const description = descriptionValue === '' ? null : descriptionValue;
    findRole.title = title || findRole.title;
    findRole.description =
      description !== undefined ? description : findRole.description;
    findRole.permissions = foundPermissions.map((permission) => permission._id);
    const updatedRole = await findRole.save();
    if (!updatedRole) throw badRequest('Role is not updated');
    return {
      id: updatedRole._id,
      title: updatedRole.title,
      description: updatedRole.description || '',
      permissions: foundPermissions.map((permission) => ({
        id: permission._id,
        title: permission.title,
        description: permission.description,
      })),
    };
  }

  async deleteRole(id, currentUser) {
    const hasPermission = await checkPermission(currentUser, 'DELETE_ROLES');
    if (!hasPermission)
      throw forbidden('You don`t have permission to delete roles');
    const findRole = await Role.findById(id);
    if (!findRole) throw notFound('Role not found');
    const usersWithRole = await User.countDocuments({ roleId: id });
    if (usersWithRole > 0)
      throw badRequest(
        `Deletion impossible, because ${usersWithRole} user(s) use this role`
      );
    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) throw badRequest('Role is not deleted');
    return deletedRole;
  }
}

module.exports = new RoleService();
