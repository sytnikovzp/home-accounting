const {
  registration,
  login,
  refresh,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
} = require('../services/authService');

function setRefreshTokenCookie(res, refreshToken) {
  res.cookie('refreshToken', refreshToken, {
    maxAge: 60 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  });
}

class AuthController {
  async registration(req, res, next) {
    try {
      const { fullName, email, password } = req.body;
      const authData = await registration(fullName, email, password);
      setRefreshTokenCookie(res, authData.refreshToken);
      res.status(201).json(authData);
    } catch (error) {
      console.log('Registration error is: ', error.message);
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const authData = await login(email, password);
      setRefreshTokenCookie(res, authData.refreshToken);
      res.status(200).json(authData);
    } catch (error) {
      console.log('Login error is: ', error.message);
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie('refreshToken');
      res.sendStatus(res.statusCode);
    } catch (error) {
      console.log('Logout error is: ', error.message);
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const authData = await refresh(refreshToken);
      setRefreshTokenCookie(res, authData.refreshToken);
      res.status(200).json(authData);
    } catch (error) {
      console.log('Refreshing error is: ', error.message);
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await getAllUsers();
      if (users.length > 0) {
        res.status(200).json(users);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.log('Get users error is: ', error.message);
      next(error);
    }
  }

  async getCurrentUserProfile(req, res, next) {
    try {
      const userEmail = req.user.email;
      const user = await getUserByEmail(userEmail);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.log('Getting user profile error is: ', error.message);
      next(error);
    }
  }

  async getUserById(req, res, next) {
    const { id } = req.params;
    try {
      const user = await getUserById(id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.log('Geting user error is: ', error.message);
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id, fullName, email, password, role } = req.body;
      const userData = await updateUser(id, fullName, email, password, role);
      res.status(201).json(userData);
    } catch (error) {
      console.log('Updating user error is: ', error.message);
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    const { id } = req.params;
    const userEmail = req.user.email;
    const currentUser = await getUserByEmail(userEmail);
    try {
      await deleteUser(id, currentUser);
      res.sendStatus(res.statusCode);
    } catch (error) {
      console.log('Deleting user error is: ', error.message);
      next(error);
    }
  }
}

module.exports = new AuthController();
