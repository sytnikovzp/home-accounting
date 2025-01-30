const {
  getCurrentUser,
  updateUser,
  changePassword,
  changeUserPhoto,
  resetUserPhoto,
  deleteUser,
} = require('../services/usersService');

class UserProfileController {
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

  static async changePassword(req, res, next) {
    try {
      const { uuid } = req.user;
      const { newPassword, confirmNewPassword } = req.body;
      const currentUser = await getCurrentUser(req.user.uuid);
      const updatedUser = await changePassword(
        uuid,
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
      const { uuid } = req.user;
      const { fullName, email, role } = req.body;
      const currentUser = await getCurrentUser(req.user.uuid);
      const updatedUser = await updateUser(
        uuid,
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
        user: { uuid },
        file: { filename },
      } = req;
      const currentUser = await getCurrentUser(req.user.uuid);
      const updatedUser = await changeUserPhoto(uuid, filename, currentUser);
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
      const { uuid } = req.user;
      const currentUser = await getCurrentUser(req.user.uuid);
      const updatedUser = await resetUserPhoto(uuid, currentUser);
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
      const { uuid } = req.user;
      const currentUser = await getCurrentUser(req.user.uuid);
      const deletedUser = await deleteUser(uuid, currentUser);
      if (deletedUser) {
        res.clearCookie('refreshToken');
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

module.exports = UserProfileController;
