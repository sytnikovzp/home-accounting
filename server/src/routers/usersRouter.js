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
  updateUser,
  changePassword,
  updateUserPhoto,
  resetUserPhoto,
  deleteUser,
} = require('../controllers/usersController');

const usersRouter = new Router();

usersRouter.use(authHandler);

usersRouter.route('/').get(paginateElements, getAllUsers);

usersRouter
  .route('/:userUuid/password')
  .patch(validatePassword, changePassword);

usersRouter
  .route('/:userUuid/photo')
  .patch(uploadUserPhotos.single('userPhoto'), updateUserPhoto);

usersRouter.route('/:userUuid/photo/reset').patch(resetUserPhoto);

usersRouter
  .route('/:userUuid')
  .get(getUserByUuid)
  .patch(validateUser, updateUser)
  .delete(deleteUser);

module.exports = usersRouter;
