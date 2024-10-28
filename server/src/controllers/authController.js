class AuthController {
  async registration(req, res, next) {
    try {
    } catch (error) {
      console.log('Error is:', error.message);
      next(error);
    }
  }

  async login(req, res, next) {
    try {
    } catch (error) {
      console.log('Error is:', error.message);
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
    } catch (error) {
      console.log('Error is:', error.message);
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
    } catch (error) {
      console.log('Error is:', error.message);
      next(error);
    }
  }
}

module.exports = new AuthController();
