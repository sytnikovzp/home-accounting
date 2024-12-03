const { sequelize } = require('../db/dbPostgres/models');
const { getCurrentUser } = require('../services/userService');
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
      const { limit, offset } = req.pagination;
      const { sort = 'id', order = 'asc' } = req.query;
      const { allMeasures, total } = await getAllMeasures(
        limit,
        offset,
        sort,
        order
      );
      if (allMeasures.length > 0) {
        res.status(200).set('X-Total-Count', total).json(allMeasures);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.log('Get all measures error: ', error.message);
      next(error);
    }
  }

  async getMeasureById(req, res, next) {
    try {
      const { measureId } = req.params;
      const measure = await getMeasureById(measureId);
      if (measure) {
        res.status(200).json(measure);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.log('Get measure by id error: ', error.message);
      next(error);
    }
  }

  async createMeasure(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { title, description } = req.body;
      const currentUser = await getCurrentUser(req.user.email);
      const newMeasure = await createMeasure(
        title,
        description,
        currentUser,
        transaction
      );
      if (newMeasure) {
        await transaction.commit();
        res.status(201).json(newMeasure);
      } else {
        await transaction.rollback();
        res.status(401);
      }
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
      const currentUser = await getCurrentUser(req.user.email);
      const updatedMeasure = await updateMeasure(
        measureId,
        title,
        description,
        currentUser,
        transaction
      );
      if (updatedMeasure) {
        await transaction.commit();
        res.status(200).json(updatedMeasure);
      } else {
        await transaction.rollback();
        res.status(401);
      }
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
      const currentUser = await getCurrentUser(req.user.email);
      const deletedMeasure = await deleteMeasure(
        measureId,
        currentUser,
        transaction
      );
      if (deletedMeasure) {
        await transaction.commit();
        res.sendStatus(res.statusCode);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.log('Delete measure error: ', error.message);
      next(error);
    }
  }
}

module.exports = new MeasureController();
