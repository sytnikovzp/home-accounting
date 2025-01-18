const { Router } = require('express');

const {
  auth: { authHandler },
  validation: { validateRole },
  pagination: { paginateElements },
} = require('../middlewares');

const {
  getAllRoles,
  getRoleByUuid,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/rolesController');

const rolesRouter = new Router();

rolesRouter
  .route('/')
  .get(authHandler, paginateElements, getAllRoles)
  .post(authHandler, validateRole, createRole);

rolesRouter
  .route('/:roleUuid')
  .get(authHandler, getRoleByUuid)
  .patch(authHandler, validateRole, updateRole)
  .delete(authHandler, deleteRole);

module.exports = rolesRouter;
