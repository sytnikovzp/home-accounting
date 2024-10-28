const {
  registration,
  login,
  logout,
  refresh,
  getAllUsers,
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
      const { refreshToken } = req.cookies;

      const token = await logout(refreshToken);

      res.clearCookie('refreshToken');

      res.status(200).json(token);
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
      console.log('Refresh error is: ', error.message);
      next(error);
    }
  }

  async getUsers(req, res, next) {
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

  async deleteUser(req, res, next) {
    const { email } = req.user;

    try {
      const { refreshToken } = req.cookies;

      const token = await logout(refreshToken);

      res.clearCookie('refreshToken');

      const delUser = await deleteUser(email);

      if (delUser) {
        res.status(200).json(token);
      } else {
        res.status(400).json('User haven`t right for deleting');
        console.log('User haven`t right for deleting');
      }
    } catch (error) {
      console.log('Deleting user error is: ', error.message);
      next(error);
    }
  }
}

module.exports = new AuthController();
