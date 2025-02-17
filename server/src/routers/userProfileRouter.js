const { Router } = require('express');

const {
  auth: { authHandler },
  validation: { validatePassword, validateUser },
  upload: { uploadUserPhoto },
} = require('../middlewares');

const {
  getCurrentUserProfile,
  changePassword,
  changeUserPhoto,
  resetUserPhoto,
  updateUser,
  deleteUser,
  confirmEmail,
  resendConfirmEmail,
} = require('../controllers/userProfileController');

const userProfileRouter = new Router();

userProfileRouter.get('/confirm', confirmEmail);

userProfileRouter.use(authHandler);

userProfileRouter
  .route('/')
  .get(getCurrentUserProfile)
  .patch(validateUser, updateUser)
  .delete(deleteUser);

userProfileRouter.route('/resend').get(resendConfirmEmail);

userProfileRouter.route('/password').patch(validatePassword, changePassword);

userProfileRouter
  .route('/photo')
  .patch(uploadUserPhoto.single('userPhoto'), changeUserPhoto)
  .delete(resetUserPhoto);

module.exports = userProfileRouter;
