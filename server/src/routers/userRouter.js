const { Router } = require('express');
// ==============================================================
const {
  getAllUsers,
  getUserById,
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
  .route('/photo/:userId')
  .patch(authHandler, uploadUserPhotos.single('userPhoto'), updateUserPhoto);

userRouter
  .route('/delete-photo/:userId')
  .patch(authHandler, removeUserPhoto);

userRouter
  .route('/:userId')
  .get(authHandler, getUserById)
  .patch(authHandler, validateUpdateUser, updateUser)
  .delete(authHandler, deleteUser);

module.exports = userRouter;
