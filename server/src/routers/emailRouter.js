const { Router } = require('express');

const {
  auth: { authHandler },
  validation: { validateResendVerify },
} = require('../middlewares');

const {
  verifyEmail,
  resendVerifyEmail,
} = require('../controllers/emailController');

const emailRouter = new Router();

emailRouter.get('/verify', verifyEmail);

emailRouter.post(
  '/resend-verify',
  authHandler,
  validateResendVerify,
  resendVerifyEmail
);

module.exports = emailRouter;
