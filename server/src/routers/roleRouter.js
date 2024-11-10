const { Router } = require('express');
// ==============================================================
const {
  getAllPermissions,
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} = require('../controllers/roleController');
const {
  auth: { authHandler },
  validation: { validateRole },
  pagination: { paginateElements },
} = require('../middlewares');

const roleRouter = new Router();

roleRouter
  .route('/permissions')
  .get(authHandler, paginateElements, getAllPermissions);

roleRouter
  .route('/')
  .get(authHandler, getAllRoles)
  .post(authHandler, validateRole, createRole);

roleRouter
  .route('/:roleId')
  .get(authHandler, getRoleById)
  .patch(authHandler, validateRole, updateRole)
  .delete(authHandler, deleteRole);

module.exports = roleRouter;
