const { Measure } = require('../db/dbPostgres/models');
const {
  formatDateTime,
  isValidUUID,
  checkPermission,
} = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/generalErrors');

const formatMeasureData = (measure) => ({
  uuid: measure.uuid,
  title: measure.title,
  description: measure.description || '',
  creation: {
    creatorUuid: measure.creatorUuid || '',
    creatorFullName: measure.creatorFullName || '',
    createdAt: formatDateTime(measure.createdAt),
    updatedAt: formatDateTime(measure.updatedAt),
  },
});

class MeasureService {
  async getAllMeasures(limit, offset, sort, order) {
    const foundMeasures = await Measure.findAll({
      attributes: ['uuid', 'title'],
      order: [[sort, order]],
      raw: true,
      limit,
      offset,
    });
    if (!foundMeasures.length)
      throw notFound('Одиниці вимірювання не знайдено');
    const total = await Measure.count();
    return {
      allMeasures: foundMeasures.map(({ uuid, title }) => ({
        uuid,
        title,
      })),
      total,
    };
  }

  async getMeasureByUuid(uuid) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const foundMeasure = await Measure.findOne({
      where: { uuid },
    });
    if (!foundMeasure) throw notFound('Одиницю вимірювання не знайдено');
    return formatMeasureData(foundMeasure);
  }

  async createMeasure(title, description, currentUser, transaction) {
    const canManageMeasures = await checkPermission(
      currentUser,
      'MANAGE_MEASURES'
    );
    if (!canManageMeasures)
      throw forbidden('Ви не маєте дозволу на створення одиниць вимірювання');
    if (await Measure.findOne({ where: { title } }))
      throw badRequest('Ця одиниця вимірювання вже існує');
    const newMeasure = await Measure.create(
      {
        title,
        description: description || null,
        creatorUuid: currentUser.uuid,
        creatorFullName: currentUser.fullName,
      },
      { transaction, returning: true }
    );
    if (!newMeasure)
      throw badRequest('Дані цієї одиниці вимірювання не створено');
    return formatMeasureData(newMeasure);
  }

  async updateMeasure(uuid, title, description, currentUser, transaction) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const foundMeasure = await Measure.findOne({ where: { uuid } });
    if (!foundMeasure) throw notFound('Одиницю вимірювання не знайдено');
    const canManageMeasures = await checkPermission(
      currentUser,
      'MANAGE_MEASURES'
    );
    if (!canManageMeasures)
      throw forbidden(
        'Ви не маєте дозволу на редагування цієї одиниці вимірювання'
      );
    if (title && title !== foundMeasure.title) {
      const duplicateMeasure = await Measure.findOne({ where: { title } });
      if (duplicateMeasure)
        throw badRequest('Ця одиниця вимірювання вже існує');
    }
    const [affectedRows, [updatedMeasure]] = await Measure.update(
      { title, description: description || null },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows)
      throw badRequest('Дані цієї одиниці вимірювання не оновлено');
    return formatMeasureData(updatedMeasure);
  }

  async deleteMeasure(uuid, currentUser, transaction) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const canManageMeasures = await checkPermission(
      currentUser,
      'MANAGE_MEASURES'
    );
    if (!canManageMeasures)
      throw forbidden(
        'Ви не маєте дозволу на видалення цієї одиниці вимірювання'
      );
    const foundMeasure = await Measure.findOne({ where: { uuid } });
    if (!foundMeasure) throw notFound('Одиницю вимірювання не знайдено');
    const deletedMeasure = await Measure.destroy({
      where: { uuid },
      transaction,
    });
    if (!deletedMeasure)
      throw badRequest('Дані цієї одиниці вимірювання не видалено');
    return deletedMeasure;
  }
}

module.exports = new MeasureService();
