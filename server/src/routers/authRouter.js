const { Router } = require('express');
// ====================================================
const {
  registration,
  login,
  logout,
  refresh,
  getUsers,
  deleteUser,
} = require('../controllers/authController');
const {
  auth: { authHandler },
  validation: { validateRegistration, validateAuth },
} = require('../middlewares');

const authRouter = new Router();

authRouter.post('/registration', validateRegistration, registration);
authRouter.post('/login', validateAuth, login);
authRouter.get('/logout', logout);
authRouter.get('/refresh', refresh);
authRouter.get('/users', authHandler, getUsers);
authRouter.delete('/delete', authHandler, deleteUser);

module.exports = authRouter;
