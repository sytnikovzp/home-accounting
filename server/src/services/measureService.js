const { Measure } = require('../db/dbPostgres/models');
const { notFound, badRequest } = require('../errors/customErrors');
const { formatDate } = require('../utils/sharedFunctions');

class MeasureService {
  async getAllMeasures() {
    const findMeasures = await Measure.findAll({
      attributes: ['id', 'title'],
      raw: true,
    });
    if (findMeasures.length === 0) throw notFound('Measures not found');
    return findMeasures;
  }

  async getMeasureById(measureId) {
    const findMeasure = await Measure.findByPk(measureId);
    if (!findMeasure) throw notFound('Measure not found');
    const measureData = findMeasure.toJSON();
    return {
      ...measureData,
      description: measureData.description || '',
      createdAt: formatDate(measureData.createdAt),
      updatedAt: formatDate(measureData.updatedAt),
    };
  }

  async createMeasure(title, descriptionValue, transaction) {
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

  async updateMeasure(id, title, descriptionValue, transaction) {
    const findMeasure = await Measure.findByPk(id);
    if (!findMeasure) throw notFound('Measure not found');
    const currentTitle = findMeasure.title;
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

  async deleteMeasure(measureId, transaction) {
    const findMeasure = await Measure.findByPk(measureId);
    if (!findMeasure) throw notFound('Measure not found');
    const deletedMeasure = await Measure.destroy({
      where: { id: measureId },
      transaction,
    });
    if (!deletedMeasure) throw badRequest('Measure is not deleted');
    return deletedMeasure;
  }
}

module.exports = new MeasureService();
