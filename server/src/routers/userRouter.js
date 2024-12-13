const { Router } = require('express');
// ==============================================================
const {
  getAllUsers,
  getUserByUuid,
  getCurrentUserProfile,
  updateUser,
  updateUserPhoto,
  removeUserPhoto,
  deleteUser,
} = require('../controllers/userController');
const {
  auth: { authHandler },
  validation: { validateUpdateUser },
  pagination: { paginateElements },
  upload: { uploadUserPhotos },
} = require('../middlewares');

const userRouter = new Router();

userRouter
  .route('/')
  .get(authHandler, paginateElements, getAllUsers);

userRouter
  .route('/profile')
  .get(authHandler, getCurrentUserProfile);

userRouter
  .route('/photo/:userUuid')
  .patch(authHandler, uploadUserPhotos.single('userPhoto'), updateUserPhoto);

userRouter
  .route('/delete-photo/:userUuid')
  .patch(authHandler, removeUserPhoto);

userRouter
  .route('/:userUuid')
  .get(authHandler, getUserByUuid)
  .patch(authHandler, validateUpdateUser, updateUser)
  .delete(authHandler, deleteUser);

module.exports = userRouter;
