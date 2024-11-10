const {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateUserPhoto,
  removeUserPhoto,
  deleteUser,
} = require('../services/userService');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const { allUsers, total } = await getAllUsers(limit, offset);
      if (allUsers.length > 0) {
        res.status(200).set('X-Total-Count', total).json(allUsers);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.log('Get all users error: ', error.message);
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const { userId } = req.params;
      const currentUser = await getCurrentUser(req.user.email);
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

  async getCurrentUserProfile(req, res, next) {
    try {
      const currentUser = await getCurrentUser(req.user.email);
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

  async updateUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { fullName, email, password, role } = req.body;
      const currentUser = await getCurrentUser(req.user.email);
      const updatedUser = await updateUser(
        userId,
        fullName,
        email,
        password,
        role,
        currentUser
      );
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(401);
      }
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
      const currentUser = await getCurrentUser(req.user.email);
      const updatedUser = await updateUserPhoto(userId, filename, currentUser);
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Update user photo error: ', error.message);
      next(error);
    }
  }

  async removeUserPhoto(req, res, next) {
    try {
      const { userId } = req.params;
      const currentUser = await getCurrentUser(req.user.email);
      const updatedUser = await removeUserPhoto(userId, currentUser);
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Remove user photo error: ', error.message);
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { userId } = req.params;
      const currentUser = await getCurrentUser(req.user.email);
      const deletedUser = await deleteUser(userId, currentUser);
      if (deletedUser) {
        res.sendStatus(res.statusCode);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.log('Delete user error: ', error.message);
      next(error);
    }
  }
}

module.exports = new UserController();
