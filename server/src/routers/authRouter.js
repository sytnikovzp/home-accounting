const { Router } = require('express');
// =====================================
const {
  registration,
  login,
  logout,
  refresh,
  getUsers,
} = require('../controllers/authController');

const authRouter = new Router();

authRouter.post('/registration', registration);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/refresh', refresh);
authRouter.get('/users', getUsers);

module.exports = authRouter;
