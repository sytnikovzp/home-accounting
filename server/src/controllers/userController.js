const {
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  updateUserPhoto,
  removeUserPhoto,
  deleteUser,
} = require('../services/userService');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await getAllUsers();
      if (users.length > 0) {
        res.status(200).json(users);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.log('Get users error: ', error.message);
      next(error);
    }
  }

  async getCurrentUserProfile(req, res, next) {
    try {
      const currentUser = await getUserByEmail(req.user.email);
      if (currentUser) {
        res.status(200).json(currentUser);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.log('Get user profile error: ', error.message);
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { userId } = req.params;
      const currentUser = await getUserByEmail(req.user.email);
      const user = await getUserById(userId, currentUser);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.log('Get user profile error: ', error.message);
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { fullName, email, password, role } = req.body;
      const currentUser = await getUserByEmail(req.user.email);
      const userData = await updateUser(
        userId,
        fullName,
        email,
        password,
        role,
        currentUser
      );
      res.status(200).json(userData);
    } catch (error) {
      console.log('Update user error: ', error.message);
      next(error);
    }
  }

  async updateUserPhoto(req, res, next) {
    try {
      const {
        params: { userId },
        file: { filename },
      } = req;
      const currentUser = await getUserByEmail(req.user.email);
      const updatedUserPhoto = await updateUserPhoto(
        userId,
        filename,
        currentUser
      );
      res.status(200).json(updatedUserPhoto);
    } catch (error) {
      console.error('Update user photo error: ', error.message);
      next(error);
    }
  }

  async removeUserPhoto(req, res, next) {
    try {
      const { userId } = req.params;
      const currentUser = await getUserByEmail(req.user.email);
      const updatedUser = await removeUserPhoto(userId, currentUser);
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error('Remove user photo error: ', error.message);
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { userId } = req.params;
      const currentUser = await getUserByEmail(req.user.email);
      await deleteUser(userId, currentUser);
      res.sendStatus(res.statusCode);
    } catch (error) {
      console.log('Delete user error: ', error.message);
      next(error);
    }
  }
}

module.exports = new UserController();
