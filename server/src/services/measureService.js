const { Measure } = require('../db/dbPostgres/models');
const { notFound, badRequest } = require('../errors/customErrors');
const { formatDate } = require('../utils/sharedFunctions');

class MeasureService {
  async getAllMeasures() {
    const allMeasures = await Measure.findAll({
      attributes: ['id', 'title'],
      raw: true,
    });
    if (allMeasures.length === 0) {
      throw notFound('Measures not found');
    }
    return allMeasures;
  }

  async getMeasureById(measureId) {
    const measureById = await Measure.findByPk(measureId);
    if (!measureById) {
      throw notFound('Measure not found');
    }
    const measureData = measureById.toJSON();
    return {
      ...measureData,
      description: measureData.description || '',
      createdAt: formatDate(measureData.createdAt),
      updatedAt: formatDate(measureData.updatedAt),
    };
  }

  async createMeasure(title, descriptionValue, transaction) {
    const existingMeasure = await Measure.findOne({ where: { title } });
    if (existingMeasure) {
      throw badRequest('This measure already exists');
    }
    const description = descriptionValue === '' ? null : descriptionValue;
    const newMeasure = await Measure.create(
      { title, description },
      { transaction }
    );
    return {
      id: newMeasure.id,
      title: newMeasure.title,
      description: newMeasure.description || '',
    };
  }

  async updateMeasure(id, title, descriptionValue, transaction) {
    const measureById = await Measure.findByPk(id);
    if (!measureById) {
      throw notFound('Measure not found');
    }
    const currentTitle = measureById.title;
    if (title !== currentTitle) {
      const existingMeasure = await Measure.findOne({ where: { title } });
      if (existingMeasure) {
        throw badRequest('This measure already exists');
      }
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
    if (affectedRows === 0) {
      throw badRequest('Measure not updated');
    }
    return {
      id: updatedMeasure.id,
      title: updatedMeasure.title,
      description: updatedMeasure.description || '',
    };
  }

  async deleteMeasure(measureId, transaction) {
    const measureById = await Measure.findByPk(measureId);
    if (!measureById) {
      throw notFound('Measure not found');
    }
    const deletedMeasure = await Measure.destroy({
      where: { id: measureId },
      transaction,
    });
    if (!deletedMeasure) {
      throw badRequest('Measure is not deleted');
    }
    return deletedMeasure;
  }
}

module.exports = new MeasureService();
