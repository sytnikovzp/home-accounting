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
      const {
        pagination: { limit, offset },
        query: { sort = 'uuid', order = 'asc' },
      } = req;
      const { allMeasures, totalCount } = await getAllMeasures(
        limit,
        offset,
        sort,
        order
      );
      if (allMeasures.length > 0) {
        res.status(200).set('X-Total-Count', totalCount).json(allMeasures);
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
      const {
        params: { measureUuid },
      } = req;
      const measureByUuid = await getMeasureByUuid(measureUuid);
      if (measureByUuid) {
        res.status(200).json(measureByUuid);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get measure by UUID error: ', error.message);
      next(error);
    }
  }

  static async createMeasure(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        body: { title, description },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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
      const {
        params: { measureUuid },
        body: { title, description },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
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
      const {
        params: { measureUuid },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
      const deletedMeasure = await deleteMeasure(
        measureUuid,
        currentUser,
        transaction
      );
      if (deletedMeasure) {
        await transaction.commit();
        res.status(200).json('OK');
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
