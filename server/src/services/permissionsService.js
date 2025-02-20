const { Permission } = require('../db/dbMongo/models');

const { notFound } = require('../errors/generalErrors');

class PermissionsService {
  static async getAllPermissions() {
    const foundPermissions = await Permission.find().lean();
    if (foundPermissions.length === 0) {
      throw notFound('Права доступу не знайдено');
    }
    const allPermissions = foundPermissions.map(
      ({ uuid, title, description }) => ({
        uuid,
        title,
        description,
      })
    );
    return {
      allPermissions,
    };
  }
}

module.exports = PermissionsService;
