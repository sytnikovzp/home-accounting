const { Router } = require('express');

const {
  validation: {
    validateRegistration,
    validateLogin,
    validateResendVerify,
    validateForgotPassword,
    validatePassword,
  },
} = require('../middlewares');

const {
  registration,
  login,
  logout,
  refresh,
  verifyEmail,
  resendVerifyEmail,
  forgotPassword,
  getResetPasswordPage,
  resetPassword,
} = require('../controllers/authController');

const authRouter = new Router();

authRouter.post('/registration', validateRegistration, registration);
authRouter.post('/login', validateLogin, login);
authRouter.get('/logout', logout);
authRouter.get('/refresh', refresh);
authRouter.get('/verify', verifyEmail);
authRouter.post('/resend-verify', validateResendVerify, resendVerifyEmail);
authRouter.post('/forgot', validateForgotPassword, forgotPassword);
authRouter.get('/reset-password', getResetPasswordPage);
authRouter.post('/reset', validatePassword, resetPassword);

module.exports = authRouter;
