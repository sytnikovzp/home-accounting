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

rolesRouter.use(authHandler);

rolesRouter
  .route('/')
  .get(paginateElements, getAllRoles)
  .post(validateRole, createRole);

rolesRouter
  .route('/:roleUuid')
  .get(getRoleByUuid)
  .patch(validateRole, updateRole)
  .delete(deleteRole);

module.exports = rolesRouter;
