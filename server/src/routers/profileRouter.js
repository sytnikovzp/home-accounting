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
} = require('../controllers/profileController');

const profileRouter = new Router();

profileRouter.use(authHandler);

profileRouter
  .route('/')
  .get(getCurrentUserProfile)
  .patch(validateUser, updateUser)
  .delete(deleteUser);

profileRouter.route('/password').patch(validatePassword, changePassword);

profileRouter
  .route('/photo')
  .patch(uploadUserPhotos.single('userPhoto'), updateUserPhoto);

profileRouter.route('/photo/reset').patch(resetUserPhoto);

module.exports = profileRouter;
