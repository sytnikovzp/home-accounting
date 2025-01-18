const { Router } = require('express');

const {
  auth: { authHandler },
} = require('../middlewares');

const { getAllPermissions } = require('../controllers/permissionsController');

const rolesRouter = new Router();

rolesRouter.route('/').get(authHandler, getAllPermissions);

module.exports = rolesRouter;
