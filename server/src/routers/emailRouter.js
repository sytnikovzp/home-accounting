const { Router } = require('express');

const {
  auth: { authHandler },
  validation: { validateResendConfirm },
} = require('../middlewares');

const {
  confirmEmail,
  resendConfirmEmail,
} = require('../controllers/emailController');

const emailRouter = new Router();

emailRouter.get('/confirm', confirmEmail);

emailRouter.post(
  '/resend-confirm',
  authHandler,
  validateResendConfirm,
  resendConfirmEmail
);

module.exports = emailRouter;
