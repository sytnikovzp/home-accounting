const { getAllPermissions } = require('../services/permissionsService');

class PermissionsController {
  static async getAllPermissions(req, res, next) {
    try {
      const { allPermissions } = await getAllPermissions();
      if (allPermissions.length > 0) {
        res.status(200).json(allPermissions);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get permissions error: ', error.message);
      next(error);
    }
  }
}

module.exports = PermissionsController;
