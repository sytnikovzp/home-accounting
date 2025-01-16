const { Router } = require('express');

const {
  auth: { authHandler },
  validation: { validateUser, validatePassword },
  pagination: { paginateElements },
  upload: { uploadUserPhotos },
} = require('../middlewares');

const {
  getAllUsers,
  getUserByUuid,
  getCurrentUserProfile,
  updateUser,
  changePassword,
  updateUserPhoto,
  deleteUserPhoto,
  deleteUser,
} = require('../controllers/usersController');

const usersRouter = new Router();

usersRouter.route('/').get(authHandler, paginateElements, getAllUsers);

usersRouter.route('/profile').get(authHandler, getCurrentUserProfile);

usersRouter
  .route('/change-password/:userUuid')
  .patch(authHandler, validatePassword, changePassword);

usersRouter
  .route('/update-photo/:userUuid')
  .patch(authHandler, uploadUserPhotos.single('userPhoto'), updateUserPhoto);

usersRouter
  .route('/delete-photo/:userUuid')
  .patch(authHandler, deleteUserPhoto);

usersRouter
  .route('/:userUuid')
  .get(authHandler, getUserByUuid)
  .patch(authHandler, validateUser, updateUser)
  .delete(authHandler, deleteUser);

module.exports = usersRouter;
