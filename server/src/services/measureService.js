const { Measure } = require('../db/dbPostgres/models');
const { formatDate, checkPermission } = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/customErrors');

class MeasureService {
  async getAllMeasures(limit, offset) {
    const foundMeasures = await Measure.findAll({
      attributes: ['id', 'title', 'description'],
      raw: true,
      limit,
      offset,
    });
    if (foundMeasures.length === 0)
      throw notFound('Одиниці вимірювання не знайдено');
    const allMeasures = foundMeasures.map((measure) => ({
      id: measure.id,
      title: measure.title,
      description: measure.description || '',
    }));
    const total = await Measure.count();
    return {
      allMeasures,
      total,
    };
  }

  async getMeasureById(measureId) {
    const foundMeasure = await Measure.findByPk(measureId);
    if (!foundMeasure) throw notFound('Одиниця вимірювання не знайдена');
    const measureData = foundMeasure.toJSON();
    return {
      ...measureData,
      description: measureData.description || '',
      createdAt: formatDate(measureData.createdAt),
      updatedAt: formatDate(measureData.updatedAt),
    };
  }

  async createMeasure(title, descriptionValue, currentUser, transaction) {
    const hasPermission = await checkPermission(currentUser, 'MANAGE_MEASURES');
    if (!hasPermission)
      throw forbidden('Ви не маєте дозволу на створення одиниць вимірювання');
    const duplicateMeasure = await Measure.findOne({ where: { title } });
    if (duplicateMeasure) throw badRequest('Ця одиниця вимірювання вже існує');
    const description = descriptionValue === '' ? null : descriptionValue;
    const newMeasure = await Measure.create(
      { title, description },
      { transaction, returning: true }
    );
    if (!newMeasure)
      throw badRequest('Дані цієї одиниці вимірювання не створено');
    return {
      id: newMeasure.id,
      title: newMeasure.title,
      description: newMeasure.description || '',
    };
  }

  async updateMeasure(id, title, descriptionValue, currentUser, transaction) {
    const hasPermission = await checkPermission(currentUser, 'MANAGE_MEASURES');
    if (!hasPermission)
      throw forbidden(
        'Ви не маєте дозволу на редагування цієї одиниці вимірювання'
      );
    const foundMeasure = await Measure.findByPk(id);
    if (!foundMeasure) throw notFound('Одиниця вимірювання не знайдена');
    const currentTitle = foundMeasure.title;
    if (title !== currentTitle) {
      const duplicateMeasure = await Measure.findOne({ where: { title } });
      if (duplicateMeasure)
        throw badRequest('Ця одиниця вимірювання вже існує');
    } else {
      title = currentTitle;
    }
    const updateData = { title };
    if (descriptionValue !== undefined) {
      const description = descriptionValue === '' ? null : descriptionValue;
      updateData.description = description;
    }
    const [affectedRows, [updatedMeasure]] = await Measure.update(updateData, {
      where: { id },
      returning: true,
      transaction,
    });
    if (affectedRows === 0)
      throw badRequest('Дані цієї одиниці вимірювання не оновлено');
    return {
      id: updatedMeasure.id,
      title: updatedMeasure.title,
      description: updatedMeasure.description || '',
    };
  }

  async deleteMeasure(measureId, currentUser, transaction) {
    const hasPermission = await checkPermission(currentUser, 'MANAGE_MEASURES');
    if (!hasPermission)
      throw forbidden(
        'Ви не маєте дозволу на видалення цієї одиниці вимірювання'
      );
    const foundMeasure = await Measure.findByPk(measureId);
    if (!foundMeasure) throw notFound('Одиниця вимірювання не знайдена');
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
