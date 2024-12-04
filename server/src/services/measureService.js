const { Measure } = require('../db/dbPostgres/models');
const { formatDateTime, checkPermission } = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/customErrors');

const formatMeasureData = (measure) => ({
  id: measure.id,
  title: measure.title,
  description: measure.description || '',
  creation: {
    creatorId: measure.creatorId || '',
    creatorFullName: measure.creatorFullName || '',
    createdAt: formatDateTime(measure.createdAt),
    updatedAt: formatDateTime(measure.updatedAt),
  },
});

class MeasureService {
  async getAllMeasures(limit, offset, sort = 'id', order = 'asc') {
    const foundMeasures = await Measure.findAll({
      attributes: ['id', 'title', 'description'],
      order: [[sort, order]],
      raw: true,
      limit,
      offset,
    });
    if (!foundMeasures.length)
      throw notFound('Одиниці вимірювання не знайдено');
    const total = await Measure.count();
    return {
      allMeasures: foundMeasures.map(({ id, title, description }) => ({
        id,
        title,
        description: description || '',
      })),
      total,
    };
  }

  async getMeasureById(measureId) {
    const foundMeasure = await Measure.findByPk(measureId);
    if (!foundMeasure) throw notFound('Одиницю вимірювання не знайдено');
    return formatMeasureData(foundMeasure.toJSON());
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
        creatorId: currentUser.id.toString(),
        creatorFullName: currentUser.fullName,
      },
      { transaction, returning: true }
    );
    if (!newMeasure)
      throw badRequest('Дані цієї одиниці вимірювання не створено');
    return formatMeasureData(newMeasure);
  }

  async updateMeasure(id, title, description, currentUser, transaction) {
    const foundMeasure = await Measure.findByPk(id);
    if (!foundMeasure) throw notFound('Одиницю вимірювання не знайдено');
    const canManageMeasures = await checkPermission(
      currentUser,
      'MANAGE_MEASURES'
    );
    if (!canManageMeasures)
      throw forbidden(
        'Ви не маєте дозволу на редагування цієї одиниці вимірювання'
      );
    if (title !== foundMeasure.title) {
      const duplicateMeasure = await Measure.findOne({ where: { title } });
      if (duplicateMeasure)
        throw badRequest('Ця одиниця вимірювання вже існує');
    }
    const [affectedRows, [updatedMeasure]] = await Measure.update(
      { title, description: description || null },
      { where: { id }, returning: true, transaction }
    );
    if (!affectedRows)
      throw badRequest('Дані цієї одиниці вимірювання не оновлено');
    return formatMeasureData(updatedMeasure);
  }

  async deleteMeasure(measureId, currentUser, transaction) {
    const canManageMeasures = await checkPermission(
      currentUser,
      'MANAGE_MEASURES'
    );
    if (!canManageMeasures)
      throw forbidden(
        'Ви не маєте дозволу на видалення цієї одиниці вимірювання'
      );
    const foundMeasure = await Measure.findByPk(measureId);
    if (!foundMeasure) throw notFound('Одиницю вимірювання не знайдено');
    const deletedMeasure = await Measure.destroy({
      where: { id: measureId },
      transaction,
    });
    if (!deletedMeasure)
      throw badRequest('Дані цієї одиниці вимірювання не видалено');
    return deletedMeasure;
  }
}

module.exports = new MeasureService();
