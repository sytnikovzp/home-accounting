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
  upload: { uploadUserPhotos },
} = require('../middlewares');

const userRouter = new Router();

userRouter
  .route('/')
  .get(authHandler, getAllUsers);

userRouter
  .route('/profile')
  .get(authHandler, getCurrentUserProfile);

userRouter
  .route('/:userId')
  .get(authHandler, getUserById)
  .patch(authHandler, validateUpdateUser, updateUser)
  .delete(authHandler, deleteUser);

userRouter
  .route('/:userId/photo')
  .patch(authHandler, uploadUserPhotos.single('userPhoto'), updateUserPhoto);

userRouter
  .route('/:userId/delphoto')
  .patch(authHandler, removeUserPhoto);

module.exports = userRouter;
