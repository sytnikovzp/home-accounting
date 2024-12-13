const { getCurrentUser } = require('../services/userService');
const {
  getAllPermissions,
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} = require('../services/roleService');

class RoleController {
  async getAllPermissions(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const { sort, order } = req.query;
      const { allPermissions, total } = await getAllPermissions(
        limit,
        offset,
        sort,
        order
      );
      if (allPermissions.length > 0) {
        res.status(200).set('X-Total-Count', total).json(allPermissions);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get permissions error: ', error.message);
      next(error);
    }
  }

  async getAllRoles(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const { sort, order } = req.query;
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

  async getRoleById(req, res, next) {
    try {
      const { roleId } = req.params;
      const role = await getRoleById(roleId);
      if (role) {
        res.status(200).json(role);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.log('Get role error: ', error.message);
      next(error);
    }
  }

  async createRole(req, res, next) {
    try {
      const { title, description, permissions } = req.body;
      const currentUser = await getCurrentUser(req.user.email);
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
      console.log('Create role error: ', error.message);
      next(error);
    }
  }

  async updateRole(req, res, next) {
    try {
      const { roleId } = req.params;
      const { title, description, permissions } = req.body;
      const currentUser = await getCurrentUser(req.user.email);
      const updatedRole = await updateRole(
        roleId,
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
      console.log('Update role error: ', error.message);
      next(error);
    }
  }

  async deleteRole(req, res, next) {
    try {
      const { roleId } = req.params;
      const currentUser = await getCurrentUser(req.user.email);
      const deletedRole = await deleteRole(roleId, currentUser);
      if (deletedRole) {
        res.sendStatus(res.statusCode);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.log('Delete role error: ', error.message);
      next(error);
    }
  }
}

module.exports = new RoleController();
