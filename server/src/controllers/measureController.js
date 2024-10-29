const { notFound, badRequest } = require('../errors/customErrors');
const { Measure, sequelize } = require('../db/dbPostgres/models');
const { formatDate } = require('../utils/sharedFunctions');

class MeasureController {
  async getAllMeasures(req, res, next) {
    try {
      const allMeasures = await Measure.findAll({
        attributes: ['id', 'title'],
        raw: true,
      });
      if (allMeasures.length > 0) {
        res.status(200).json(allMeasures);
      } else {
        throw notFound('Measures not found');
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async getMeasureById(req, res, next) {
    try {
      const { measureId } = req.params;
      const measureById = await Measure.findByPk(measureId);
      if (measureById) {
        const measureData = measureById.toJSON();
        const formattedMeasure = {
          ...measureData,
          description: measureData.description || '',
          createdAt: formatDate(measureData.createdAt),
          updatedAt: formatDate(measureData.updatedAt),
        };
        res.status(200).json(formattedMeasure);
      } else {
        throw notFound('Measure not found');
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async createMeasure(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { title, description: descriptionValue } = req.body;
      const description = descriptionValue === '' ? null : descriptionValue;
      const newBody = { title, description };
      const newMeasure = await Measure.create(newBody, {
        transaction: t,
        returning: true,
      });
      if (newMeasure) {
        const measureData = newMeasure.toJSON();
        const formattedNewMeasure = {
          ...measureData,
          description: measureData.description || '',
        };
        await t.commit();
        res.status(201).json(formattedNewMeasure);
      } else {
        await t.rollback();
        throw badRequest('Measure is not created');
      }
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      next(error);
    }
  }

  async updateMeasure(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { id, title, description: descriptionValue } = req.body;
      const description = descriptionValue === '' ? null : descriptionValue;
      const newBody = { title, description };
      const [affectedRows, [updatedMeasure]] = await Measure.update(newBody, {
        where: { id },
        returning: true,
        transaction: t,
      });
      if (affectedRows > 0) {
        const measureData = updatedMeasure.toJSON();
        const formattedUpdMeasure = {
          ...measureData,
          description: measureData.description || '',
        };
        await t.commit();
        res.status(200).json(formattedUpdMeasure);
      } else {
        await t.rollback();
        throw badRequest('Measure is not updated');
      }
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      next(error);
    }
  }

  async deleteMeasure(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { measureId } = req.params;
      const deleteMeasure = await Measure.destroy({
        where: {
          id: measureId,
        },
        transaction: t,
      });
      if (deleteMeasure) {
        await t.commit();
        res.sendStatus(res.statusCode);
      } else {
        await t.rollback();
        throw badRequest('Measure is not deleted');
      }
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      next(error);
    }
  }
}

module.exports = new MeasureController();
