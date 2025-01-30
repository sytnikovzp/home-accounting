const { Router } = require('express');

const {
  auth: { authHandler },
  validation: { validateUser, validatePassword },
  pagination: { paginateElements },
  upload: { uploadUserPhoto },
} = require('../middlewares');

const {
  getAllUsers,
  getUserByUuid,
  updateUser,
  changePassword,
  changeUserPhoto,
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
  .patch(uploadUserPhoto.single('userPhoto'), changeUserPhoto)
  .delete(resetUserPhoto);

usersRouter
  .route('/:userUuid')
  .get(getUserByUuid)
  .patch(validateUser, updateUser)
  .delete(deleteUser);

module.exports = usersRouter;
