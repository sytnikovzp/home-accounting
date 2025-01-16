const { sequelize } = require('../db/dbPostgres/models');

const {
  getAllMeasures,
  getMeasureByUuid,
  createMeasure,
  updateMeasure,
  deleteMeasure,
} = require('../services/measuresService');
const { getCurrentUser } = require('../services/usersService');

class MeasuresController {
  static async getAllMeasures(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const { sort = 'uuid', order = 'asc' } = req.query;
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
      console.error('Get all measures error: ', error.message);
      next(error);
    }
  }

  static async getMeasureByUuid(req, res, next) {
    try {
      const { measureUuid } = req.params;
      const measure = await getMeasureByUuid(measureUuid);
      if (measure) {
        res.status(200).json(measure);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get measure by uuid error: ', error.message);
      next(error);
    }
  }

  static async createMeasure(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { title, description } = req.body;
      const currentUser = await getCurrentUser(req.user.uuid);
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
      console.error('Create measure error: ', error.message);
      next(error);
    }
  }

  static async updateMeasure(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { measureUuid } = req.params;
      const { title, description } = req.body;
      const currentUser = await getCurrentUser(req.user.uuid);
      const updatedMeasure = await updateMeasure(
        measureUuid,
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
      console.error('Update measure error: ', error.message);
      next(error);
    }
  }

  static async deleteMeasure(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { measureUuid } = req.params;
      const currentUser = await getCurrentUser(req.user.uuid);
      const deletedMeasure = await deleteMeasure(
        measureUuid,
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
      console.error('Delete measure error: ', error.message);
      next(error);
    }
  }
}

module.exports = MeasuresController;
