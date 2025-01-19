const {
  getAllUsers,
  getUserByUuid,
  getCurrentUser,
  updateUser,
  changePassword,
  updateUserPhoto,
  resetUserPhoto,
  deleteUser,
} = require('../services/usersService');

class UserController {
  static async getAllUsers(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const {
        emailVerificationStatus,
        sort = 'uuid',
        order = 'asc',
      } = req.query;
      const { allUsers, total } = await getAllUsers(
        emailVerificationStatus,
        limit,
        offset,
        sort,
        order
      );
      if (allUsers.length > 0) {
        res.status(200).set('X-Total-Count', total).json(allUsers);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get all users error: ', error.message);
      next(error);
    }
  }

  static async getUserByUuid(req, res, next) {
    try {
      const { userUuid } = req.params;
      const currentUser = await getCurrentUser(req.user.uuid);
      const user = await getUserByUuid(userUuid, currentUser);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get user profile error: ', error.message);
      next(error);
    }
  }

  static async getCurrentUserProfile(req, res, next) {
    try {
      const currentUser = await getCurrentUser(req.user.uuid);
      if (currentUser) {
        res.status(200).json(currentUser);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get user profile error: ', error.message);
      next(error);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const { userUuid } = req.params;
      const { fullName, email, role } = req.body;
      const currentUser = await getCurrentUser(req.user.uuid);
      const updatedUser = await updateUser(
        userUuid,
        fullName,
        email,
        role,
        currentUser
      );
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Update user error: ', error.message);
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const { userUuid } = req.params;
      const { newPassword, confirmNewPassword } = req.body;
      const currentUser = await getCurrentUser(req.user.uuid);
      const updatedUser = await changePassword(
        userUuid,
        newPassword,
        confirmNewPassword,
        currentUser
      );
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Change password error: ', error.message);
      next(error);
    }
  }

  static async updateUserPhoto(req, res, next) {
    try {
      const {
        params: { userUuid },
        file: { filename },
      } = req;
      const currentUser = await getCurrentUser(req.user.uuid);
      const updatedUser = await updateUserPhoto(
        userUuid,
        filename,
        currentUser
      );
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

  static async resetUserPhoto(req, res, next) {
    try {
      const { userUuid } = req.params;
      const currentUser = await getCurrentUser(req.user.uuid);
      const updatedUser = await resetUserPhoto(userUuid, currentUser);
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

  static async deleteUser(req, res, next) {
    try {
      const { userUuid } = req.params;
      const currentUser = await getCurrentUser(req.user.uuid);
      const deletedUser = await deleteUser(userUuid, currentUser);
      if (deletedUser) {
        if (currentUser.uuid === userUuid) {
          res.clearCookie('refreshToken');
        }
        res.sendStatus(res.statusCode);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Delete user error: ', error.message);
      next(error);
    }
  }
}

module.exports = UserController;
