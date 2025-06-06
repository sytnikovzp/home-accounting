const {
  API_CONFIG: { CLIENT_URL },
} = require('../constants');
const { checkToken } = require('../utils/authHelpers');

const {
  getCurrentUser,
  updateUser,
  changePassword,
  changeUserPhoto,
  resetUserPhoto,
  deleteUser,
  confirmEmail,
  resendConfirmEmail,
} = require('../services/usersService');

class UserProfileController {
  static async getCurrentUserProfile(req, res, next) {
    try {
      const {
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
      if (currentUser) {
        res.status(200).json(currentUser);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get current user profile error: ', error.message);
      next(error);
    }
  }

  static async confirmEmail(req, res, next) {
    try {
      const {
        query: { token },
      } = req;
      await checkToken(token, 'confirm');
      await confirmEmail(token);
      res.redirect(`${CLIENT_URL}/notification?success=email-confirmed`);
    } catch (error) {
      res.redirect(`${CLIENT_URL}/notification?error=expired-token`);
      console.error('Confirmation email error: ', error.message);
      next(error);
    }
  }

  static async resendConfirmEmail(req, res, next) {
    try {
      const {
        user: { uuid },
      } = req;
      await resendConfirmEmail(uuid);
      res.status(200).json({
        severity: 'success',
        title: 'Підтвердження email',
        message:
          'На Вашу електронну адресу відправлено повідомлення з подальшими інструкціями',
      });
    } catch (error) {
      console.error('Resend confirmation email error: ', error.message);
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const {
        body: { newPassword, confirmNewPassword },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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
      const {
        body: { fullName, email, role },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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
        file: { filename },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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
      const {
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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
      const {
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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
