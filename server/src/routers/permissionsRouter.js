const { Router } = require('express');

const {
  auth: { authHandler },
} = require('../middlewares');

const { getAllPermissions } = require('../controllers/permissionsController');

const rolesRouter = new Router();

rolesRouter.use(authHandler);

rolesRouter.route('/').get(getAllPermissions);

module.exports = rolesRouter;
