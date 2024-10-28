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
  deleteUser,
} = require('../controllers/authController');
const {
  auth: { authHandler },
  validation: { validateRegistration, validateAuth },
} = require('../middlewares');

const authRouter = new Router();

authRouter.post('/registration', validateRegistration, registration);
authRouter.post('/login', validateAuth, login);
authRouter.get('/logout', logout);
authRouter.get('/refresh', refresh);
authRouter.get('/users', authHandler, getAllUsers);
authRouter.get('/profile', authHandler, getCurrentUserProfile);
authRouter.get('/users/:id', authHandler, getUserById);
authRouter.put('/users', authHandler, validateRegistration, updateUser);
authRouter.delete('/delete/:id', authHandler, deleteUser);

module.exports = authRouter;
