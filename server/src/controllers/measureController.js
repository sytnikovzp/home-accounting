const { sequelize } = require('../db/dbPostgres/models');
const {
  getAllMeasures,
  getMeasureById,
  createMeasure,
  updateMeasure,
  deleteMeasure,
} = require('../services/measureService');

class MeasureController {
  async getAllMeasures(req, res, next) {
    try {
      const allMeasures = await getAllMeasures();
      res.status(200).json(allMeasures);
    } catch (error) {
      console.log('Get all measures error: ', error.message);
      next(error);
    }
  }

  async getMeasureById(req, res, next) {
    try {
      const { measureId } = req.params;
      const measure = await getMeasureById(measureId);
      res.status(200).json(measure);
    } catch (error) {
      console.log('Get measure by id error: ', error.message);
      next(error);
    }
  }

  async createMeasure(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { title, description } = req.body;
      const newMeasure = await createMeasure(title, description, transaction);
      await transaction.commit();
      res.status(201).json(newMeasure);
    } catch (error) {
      await transaction.rollback();
      console.log('Create measure error: ', error.message);
      next(error);
    }
  }

  async updateMeasure(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { measureId } = req.params;
      const { title, description } = req.body;
      const updatedMeasure = await updateMeasure(
        measureId,
        title,
        description,
        transaction
      );
      await transaction.commit();
      res.status(201).json(updatedMeasure);
    } catch (error) {
      await transaction.rollback();
      console.log('Update measure error: ', error.message);
      next(error);
    }
  }

  async deleteMeasure(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { measureId } = req.params;
      await deleteMeasure(measureId, transaction);
      await transaction.commit();
      res.sendStatus(res.statusCode);
    } catch (error) {
      await transaction.rollback();
      console.log('Delete measure error: ', error.message);
      next(error);
    }
  }
}

module.exports = new MeasureController();
