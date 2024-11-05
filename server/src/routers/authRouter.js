const { Router } = require('express');
// ==============================================================
const {
  registration,
  login,
  logout,
  refresh,
  getAllUsers,
  getUserById,
  getCurrentUserProfile,
  updateUser,
  updateUserPhoto,
  removeUserPhoto,
  deleteUser,
} = require('../controllers/authController');
const {
  auth: { authHandler },
  validation: { validateRegistration, validateUpdateUser, validateAuth },
  upload: { uploadUserPhotos },
} = require('../middlewares');

const authRouter = new Router();

authRouter.post('/registration', validateRegistration, registration);
authRouter.post('/login', validateAuth, login);
authRouter.get('/logout', logout);
authRouter.get('/refresh', refresh);
authRouter.get('/users', authHandler, getAllUsers);
authRouter.get('/profile', authHandler, getCurrentUserProfile);
authRouter.get('/users/:userId', authHandler, getUserById);
authRouter.patch('/users/:userId', authHandler, validateUpdateUser, updateUser);
authRouter.patch(
  '/users/:userId/photo',
  authHandler,
  uploadUserPhotos.single('userPhoto'),
  updateUserPhoto
);
authRouter.patch('/users/:userId/delphoto', authHandler, removeUserPhoto);
authRouter.delete('/users/:userId', authHandler, deleteUser);

module.exports = authRouter;
