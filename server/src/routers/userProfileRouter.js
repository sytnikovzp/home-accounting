const { Router } = require('express');

const {
  auth: { authHandler },
  validation: { validatePassword, validateUser },
  upload: { uploadUserPhotos },
} = require('../middlewares');

const {
  getCurrentUserProfile,
  changePassword,
  updateUserPhoto,
  resetUserPhoto,
  deleteUser,
  updateUser,
} = require('../controllers/userProfileController');

const userProfileRouter = new Router();

userProfileRouter.use(authHandler);

userProfileRouter
  .route('/')
  .get(getCurrentUserProfile)
  .patch(validateUser, updateUser)
  .delete(deleteUser);

userProfileRouter.route('/password').patch(validatePassword, changePassword);

userProfileRouter
  .route('/photo')
  .patch(uploadUserPhotos.single('userPhoto'), updateUserPhoto);

userProfileRouter.route('/photo/reset').patch(resetUserPhoto);

module.exports = userProfileRouter;
