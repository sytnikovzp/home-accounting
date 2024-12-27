const { Router } = require('express');
// ==============================================================
const {
  registration,
  login,
  logout,
  refresh,
  verifyEmail,
  resendVerifyEmail,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const {
  validation: {
    validateRegistration,
    validateLogin,
    validateResendVerify,
    validateForgotPassword,
    validateResetPassword,
  },
} = require('../middlewares');

const authRouter = new Router();

authRouter.post('/registration', validateRegistration, registration);
authRouter.post('/login', validateLogin, login);
authRouter.get('/logout', logout);
authRouter.get('/verify', verifyEmail);
authRouter.post('/resend-verify', validateResendVerify, resendVerifyEmail);
authRouter.get('/refresh', refresh);
authRouter.post('/forgot', validateForgotPassword, forgotPassword);
authRouter.post('/reset', validateResetPassword, resetPassword);

module.exports = authRouter;
