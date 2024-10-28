const { Router } = require('express');
// =====================================
const {
  registration,
  login,
  logout,
  refresh,
} = require('../controllers/authController');

const authRouter = new Router();

authRouter.post('registration', registration);
authRouter.post('login', login);
authRouter.post('logout', logout);
authRouter.post('refresh', refresh);

module.exports = authRouter;
