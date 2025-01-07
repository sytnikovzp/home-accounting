const { Router } = require('express');

const {
  auth: { authHandler },
  validation: { validateRole },
  pagination: { paginateElements },
} = require('../middlewares');

const {
  getAllPermissions,
  getAllRoles,
  getRoleByUuid,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/roleController');

const roleRouter = new Router();

roleRouter
  .route('/')
  .get(authHandler, paginateElements, getAllRoles)
  .post(authHandler, validateRole, createRole);

roleRouter.route('/permissions').get(authHandler, getAllPermissions);

roleRouter
  .route('/:roleUuid')
  .get(authHandler, getRoleByUuid)
  .patch(authHandler, validateRole, updateRole)
  .delete(authHandler, deleteRole);

module.exports = roleRouter;
