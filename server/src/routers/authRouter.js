const { Router } = require('express');
// ==============================================================
const {
  registration,
  login,
  logout,
  activate,
  refresh,
} = require('../controllers/authController');
const {
  validation: { validateRegistration, validateAuth },
} = require('../middlewares');

const authRouter = new Router();

authRouter.post('/registration', validateRegistration, registration);
authRouter.post('/login', validateAuth, login);
authRouter.get('/logout', logout);
authRouter.get('/activate/:link', activate);
authRouter.get('/refresh', refresh);

module.exports = authRouter;
