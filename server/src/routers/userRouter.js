const { Router } = require('express');
// ==============================================================
const {
  getAllUsers,
  getUserByUuid,
  getCurrentUserProfile,
  updateUser,
  changePassword,
  updateUserPhoto,
  removeUserPhoto,
  deleteUser,
} = require('../controllers/userController');
const {
  auth: { authHandler },
  validation: { validateUser, validatePassword },
  pagination: { paginateElements },
  upload: { uploadUserPhotos },
} = require('../middlewares');

const userRouter = new Router();

userRouter.route('/').get(authHandler, paginateElements, getAllUsers);

userRouter.route('/profile').get(authHandler, getCurrentUserProfile);

userRouter
  .route('/change-password/:userUuid')
  .patch(authHandler, validatePassword, changePassword);

userRouter
  .route('/update-photo/:userUuid')
  .patch(authHandler, uploadUserPhotos.single('userPhoto'), updateUserPhoto);

userRouter.route('/delete-photo/:userUuid').patch(authHandler, removeUserPhoto);

userRouter
  .route('/:userUuid')
  .get(authHandler, getUserByUuid)
  .patch(authHandler, validateUser, updateUser)
  .delete(authHandler, deleteUser);

module.exports = userRouter;
