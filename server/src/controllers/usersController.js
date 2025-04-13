const {
  getAllUsers,
  getUserByUuid,
  getCurrentUser,
  updateUser,
  changePassword,
  changeUserPhoto,
  resetUserPhoto,
  deleteUser,
} = require('../services/usersService');

class UsersController {
  static async getAllUsers(req, res, next) {
    try {
      const {
        pagination: { limit, offset },
        query: { emailConfirm, sort = 'uuid', order = 'asc' },
      } = req;
      const { allUsers, totalCount } = await getAllUsers(
        emailConfirm,
        limit,
        offset,
        sort,
        order
      );
      if (allUsers.length > 0) {
        res.status(200).set('X-Total-Count', totalCount).json(allUsers);
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
      const {
        params: { userUuid },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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

  static async changePassword(req, res, next) {
    try {
      const {
        params: { userUuid },
        body: { newPassword, confirmNewPassword },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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

  static async updateUser(req, res, next) {
    try {
      const {
        params: { userUuid },
        body: { fullName, email, role },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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

  static async changeUserPhoto(req, res, next) {
    try {
      const {
        params: { userUuid },
        file: { filename },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
      const updatedUser = await changeUserPhoto(
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
      console.error('Change user photo error: ', error.message);
      next(error);
    }
  }

  static async resetUserPhoto(req, res, next) {
    try {
      const {
        params: { userUuid },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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
      const {
        params: { userUuid },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
      const deletedUser = await deleteUser(userUuid, currentUser);
      if (deletedUser) {
        if (currentUser.uuid === userUuid) {
          res.clearCookie('refreshToken');
        }
        res.status(200).json('OK');
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Delete user error: ', error.message);
      next(error);
    }
  }
}

module.exports = UsersController;
