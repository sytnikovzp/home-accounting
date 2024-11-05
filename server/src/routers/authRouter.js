const { Router } = require('express');
// ==============================================================
const {
  registration,
  login,
  logout,
  refresh,
} = require('../controllers/authController');
const {
  validation: { validateRegistration, validateAuth },
} = require('../middlewares');

const authRouter = new Router();

authRouter.post('/registration', validateRegistration, registration);
authRouter.post('/login', validateAuth, login);
authRouter.get('/logout', logout);
authRouter.get('/refresh', refresh);

module.exports = authRouter;
