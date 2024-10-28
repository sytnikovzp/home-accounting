const authService = require('../services/authService');

class AuthController {
  async registration(req, res, next) {
    try {
      const { fullName, email, password } = req.body;

      const authData = await authService.registration(
        fullName,
        email,
        password
      );

      res.cookie('refreshToken', authData.refreshToken, {
        maxAge: 60 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.status(201).json(authData);
    } catch (error) {
      console.log('Registration error is:', error.message);
      next(error);
    }
  }

  async login(req, res, next) {
    try {

      
    } catch (error) {
      console.log('Login error is:', error.message);
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
    } catch (error) {
      console.log('Logout error is:', error.message);
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
    } catch (error) {
      console.log('Refresh error is:', error.message);
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
    } catch (error) {
      console.log('Get users error is:', error.message);
      next(error);
    }
  }
}

module.exports = new AuthController();
