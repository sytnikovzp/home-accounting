const { Role, User, Permission } = require('../db/dbMongo/models');
const { formatDate, checkPermission } = require('../utils/sharedFunctions');
const { badRequest, notFound, forbidden } = require('../errors/customErrors');

class RoleService {
  async getAllPermissions(limit, offset) {
    const foundPermissions = await Permission.find()
      .limit(limit)
      .skip(offset)
      .lean();
    if (foundPermissions.length === 0) throw notFound('Permissions not found');
    const allPermissions = foundPermissions.map(({ _id, ...permission }) => ({
      id: _id,
      ...permission,
    }));
    const total = await Permission.countDocuments();
    return {
      allPermissions,
      total,
    };
  }

  async getAllRoles(limit, offset) {
    const foundRoles = await Role.find()
      .populate('permissions')
      .limit(limit)
      .skip(offset)
      .lean();
    if (foundRoles.length === 0) throw notFound('Roles not found');
    const allRoles = foundRoles.map(
      ({ _id, title, description, permissions }) => ({
        id: _id,
        title,
        description: description || '',
        permissions: permissions.map(({ _id, title }) => ({
          id: _id,
          title,
        })),
      })
    );
    const total = await Role.countDocuments();
    return {
      allRoles,
      total,
    };
  }

  async getRoleById(id) {
    const foundRole = await Role.findById(id).populate('permissions');
    if (!foundRole) throw notFound('Role not found');
    return {
      id: foundRole._id,
      title: foundRole.title,
      description: foundRole.description || '',
      permissions: foundRole.permissions.map(({ _id, title, description }) => ({
        id: _id,
        title,
        description,
      })),
      createdAt: formatDate(foundRole.createdAt),
      updatedAt: formatDate(foundRole.updatedAt),
    };
  }

  async createRole(title, descriptionValue, permissions, currentUser) {
    const hasPermission = await checkPermission(currentUser, 'MANAGE_ROLES');
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
    const hasPermission = await checkPermission(currentUser, 'MANAGE_ROLES');
    if (!hasPermission)
      throw forbidden('You don`t have permission to edit roles for users');
    const foundRole = await Role.findById(id);
    if (!foundRole) throw notFound('Role not found');
    const updateData = {};
    if (title && title !== foundRole.title) {
      const duplicateRole = await Role.findOne({ title });
      if (duplicateRole) throw badRequest('This role already exists');
      updateData.title = title;
    }
    if (descriptionValue !== undefined) {
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
            `Some permissions were not found: ${missingPermissions.join(', ')}`
          );
        }
        updateData.permissions = foundPermissions.map(
          (permission) => permission._id
        );
      }
    }
    const updatedRole = await Role.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedRole) throw badRequest('Role is not updated');
    const updatedPermissions = await Permission.find({
      _id: { $in: updatedRole.permissions },
    });
    return {
      id: updatedRole._id,
      title: updatedRole.title,
      description: updatedRole.description || '',
      permissions: updatedPermissions.map((permission) => ({
        id: permission._id,
        title: permission.title,
        description: permission.description,
      })),
    };
  }

  async deleteRole(id, currentUser) {
    const hasPermission = await checkPermission(currentUser, 'MANAGE_ROLES');
    if (!hasPermission)
      throw forbidden('You don`t have permission to delete roles for users');
    const foundRole = await Role.findById(id);
    if (!foundRole) throw notFound('Role not found');
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
