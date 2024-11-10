const { Measure } = require('../db/dbPostgres/models');
const { formatDate, checkPermission } = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/customErrors');

class MeasureService {
  async getAllMeasures() {
    const foundMeasures = await Measure.findAll({
      attributes: ['id', 'title'],
      raw: true,
    });
    if (foundMeasures.length === 0) throw notFound('Measures not found');
    return foundMeasures;
  }

  async getMeasureById(measureId) {
    const foundMeasure = await Measure.findByPk(measureId);
    if (!foundMeasure) throw notFound('Measure not found');
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
      throw forbidden('You don`t have permission to create measures');
    const duplicateMeasure = await Measure.findOne({ where: { title } });
    if (duplicateMeasure) throw badRequest('This measure already exists');
    const description = descriptionValue === '' ? null : descriptionValue;
    const newMeasure = await Measure.create(
      { title, description },
      { transaction, returning: true }
    );
    if (!newMeasure) throw badRequest('Measure is not created');
    return {
      id: newMeasure.id,
      title: newMeasure.title,
      description: newMeasure.description || '',
    };
  }

  async updateMeasure(id, title, descriptionValue, currentUser, transaction) {
    const hasPermission = await checkPermission(currentUser, 'MANAGE_MEASURES');
    if (!hasPermission)
      throw forbidden('You don`t have permission to edit measures');
    const foundMeasure = await Measure.findByPk(id);
    if (!foundMeasure) throw notFound('Measure not found');
    const currentTitle = foundMeasure.title;
    if (title !== currentTitle) {
      const duplicateMeasure = await Measure.findOne({ where: { title } });
      if (duplicateMeasure) throw badRequest('This measure already exists');
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
    if (affectedRows === 0) throw badRequest('Measure is not updated');
    return {
      id: updatedMeasure.id,
      title: updatedMeasure.title,
      description: updatedMeasure.description || '',
    };
  }

  async deleteMeasure(measureId, currentUser, transaction) {
    const hasPermission = await checkPermission(currentUser, 'MANAGE_MEASURES');
    if (!hasPermission)
      throw forbidden('You don`t have permission to delete measures');
    const foundMeasure = await Measure.findByPk(measureId);
    if (!foundMeasure) throw notFound('Measure not found');
    const deletedMeasure = await Measure.destroy({
      where: { id: measureId },
      transaction,
    });
    if (!deletedMeasure) throw badRequest('Measure is not deleted');
    return deletedMeasure;
  }
}

module.exports = new MeasureService();
