const {
  getAllRoles,
  getRoleByUuid,
  createRole,
  updateRole,
  deleteRole,
} = require('../services/rolesService');
const { getCurrentUser } = require('../services/usersService');

class RolesController {
  static async getAllRoles(req, res, next) {
    try {
      const {
        pagination: { limit, offset },
        query: { sort = 'uuid', order = 'asc' },
      } = req;
      const { allRoles, totalCount } = await getAllRoles(
        limit,
        offset,
        sort,
        order
      );
      if (allRoles.length > 0) {
        res.status(200).set('X-Total-Count', totalCount).json(allRoles);
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
      const {
        body: { title, description, permissions },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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
      const {
        params: { roleUuid },
        body: { title, description, permissions },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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
      const {
        params: { roleUuid },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
      const deletedRole = await deleteRole(roleUuid, currentUser);
      if (deletedRole) {
        res.status(200).json('OK');
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
