const {
  getAllPermissions,
  getAllRoles,
  getRoleByUuid,
  createRole,
  updateRole,
  deleteRole,
} = require('../services/rolesService');
const { getCurrentUser } = require('../services/usersService');

class RolesController {
  static async getAllPermissions(req, res, next) {
    try {
      const { allPermissions } = await getAllPermissions();
      if (allPermissions.length > 0) {
        res.status(200).json(allPermissions);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get permissions error: ', error.message);
      next(error);
    }
  }

  static async getAllRoles(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const { sort = 'uuid', order = 'asc' } = req.query;
      const { allRoles, total } = await getAllRoles(limit, offset, sort, order);
      if (allRoles.length > 0) {
        res.status(200).set('X-Total-Count', total).json(allRoles);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get roles error: ', error.message);
      next(error);
    }
  }

  static async getRoleByUuid(req, res, next) {
    try {
      const { roleUuid } = req.params;
      const role = await getRoleByUuid(roleUuid);
      if (role) {
        res.status(200).json(role);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get role error: ', error.message);
      next(error);
    }
  }

  static async createRole(req, res, next) {
    try {
      const { title, description, permissions } = req.body;
      const currentUser = await getCurrentUser(req.user.uuid);
      const newRole = await createRole(
        title,
        description,
        permissions,
        currentUser
      );
      if (newRole) {
        res.status(201).json(newRole);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Create role error: ', error.message);
      next(error);
    }
  }

  static async updateRole(req, res, next) {
    try {
      const { roleUuid } = req.params;
      const { title, description, permissions } = req.body;
      const currentUser = await getCurrentUser(req.user.uuid);
      const updatedRole = await updateRole(
        roleUuid,
        title,
        description,
        permissions,
        currentUser
      );
      if (updatedRole) {
        res.status(200).json(updatedRole);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Update role error: ', error.message);
      next(error);
    }
  }

  static async deleteRole(req, res, next) {
    try {
      const { roleUuid } = req.params;
      const currentUser = await getCurrentUser(req.user.uuid);
      const deletedRole = await deleteRole(roleUuid, currentUser);
      if (deletedRole) {
        res.sendStatus(res.statusCode);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Delete role error: ', error.message);
      next(error);
    }
  }
}

module.exports = RolesController;
