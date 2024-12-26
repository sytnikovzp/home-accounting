const { Router } = require('express');
// ==============================================================
const {
  registration,
  login,
  logout,
  verification,
  refresh,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const {
  validation: {
    validateRegistration,
    validateLogin,
    validateForgotPassword,
    validateChangePassword,
  },
} = require('../middlewares');

const authRouter = new Router();

authRouter.post('/registration', validateRegistration, registration);
authRouter.post('/login', validateLogin, login);
authRouter.get('/logout', logout);
authRouter.get('/verification', verification);
authRouter.get('/refresh', refresh);
authRouter.post('/forgot', validateForgotPassword, forgotPassword);
authRouter.post('/reset', validateChangePassword, resetPassword);

module.exports = authRouter;
