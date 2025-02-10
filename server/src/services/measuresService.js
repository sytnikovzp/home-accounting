const { Measure } = require('../db/dbPostgres/models');

const { notFound, badRequest, forbidden } = require('../errors/generalErrors');
const {
  formatDateTime,
  isValidUUID,
  checkPermission,
} = require('../utils/sharedFunctions');

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

class MeasuresService {
  static async getAllMeasures(limit, offset, sort, order) {
    const foundMeasures = await Measure.findAll({
      attributes: ['uuid', 'title', 'description'],
      order: [[sort, order]],
      raw: true,
      limit,
      offset,
    });
    if (!foundMeasures.length) {
      throw notFound('Одиниці вимірів не знайдено');
    }
    const total = await Measure.count();
    return {
      allMeasures: foundMeasures.map(({ uuid, title, description }) => ({
        uuid,
        title,
        description,
      })),
      total,
    };
  }

  static async getMeasureByUuid(uuid) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundMeasure = await Measure.findOne({
      where: { uuid },
    });
    if (!foundMeasure) {
      throw notFound('Одиницю вимірів не знайдено');
    }
    return formatMeasureData(foundMeasure);
  }

  static async createMeasure(title, description, currentUser, transaction) {
    if (await Measure.findOne({ where: { title } })) {
      throw badRequest('Ця одиниця вимірів вже існує');
    }
    const canAddMeasures = await checkPermission(currentUser, 'ADD_MEASURES');
    if (!canAddMeasures) {
      throw forbidden('Ви не маєте дозволу на додавання одиниць вимірів');
    }
    const newMeasure = await Measure.create(
      {
        title,
        description: description || null,
        creatorUuid: currentUser.uuid,
        creatorFullName: currentUser.fullName,
      },
      { transaction, returning: true }
    );
    if (!newMeasure) {
      throw badRequest('Дані цієї одиниці вимірів не створено');
    }
    return formatMeasureData(newMeasure);
  }

  static async updateMeasure(
    uuid,
    title,
    description,
    currentUser,
    transaction
  ) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundMeasure = await Measure.findOne({ where: { uuid } });
    if (!foundMeasure) {
      throw notFound('Одиницю вимірів не знайдено');
    }
    const canEditMeasures = await checkPermission(currentUser, 'EDIT_MEASURES');
    if (!canEditMeasures) {
      throw forbidden(
        'Ви не маєте дозволу на редагування цієї одиниці вимірів'
      );
    }
    if (title && title !== foundMeasure.title) {
      const duplicateMeasure = await Measure.findOne({ where: { title } });
      if (duplicateMeasure) {
        throw badRequest('Ця одиниця вимірів вже існує');
      }
    }
    const [affectedRows, [updatedMeasure]] = await Measure.update(
      { title, description: description || null },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows) {
      throw badRequest('Дані цієї одиниці вимірів не оновлено');
    }
    return formatMeasureData(updatedMeasure);
  }

  static async deleteMeasure(uuid, currentUser, transaction) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundMeasure = await Measure.findOne({ where: { uuid } });
    if (!foundMeasure) {
      throw notFound('Одиницю вимірів не знайдено');
    }
    const canRemoveMeasures = await checkPermission(
      currentUser,
      'REMOVE_MEASURES'
    );
    if (!canRemoveMeasures) {
      throw forbidden('Ви не маєте дозволу на видалення цієї одиниці вимірів');
    }
    const deletedMeasure = await Measure.destroy({
      where: { uuid },
      transaction,
    });
    if (!deletedMeasure) {
      throw badRequest('Дані цієї одиниці вимірів не видалено');
    }
    return deletedMeasure;
  }
}

module.exports = MeasuresService;
