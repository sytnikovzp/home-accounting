const createError = require('http-errors');
const { format } = require('date-fns');
// =====================================
const { Measure, sequelize } = require('../db/dbPostgres/models');

class measureController {
  async getAllMeasures(req, res, next) {
    try {
      const allMeasures = await Measure.findAll({
        attributes: ['id', 'title'],
        raw: true,
      });

      if (allMeasures.length > 0) {
        res.status(200).json(allMeasures);
      } else {
        next(createError(404, 'Measures not found'));
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async getMeasureById(req, res, next) {
    const { measureId } = req.params;

    try {
      const measureById = await Measure.findByPk(measureId);

      if (measureById) {
        const measureData = measureById.toJSON();

        const formattedMeasure = {
          ...measureData,
          description: measureData.description || '',
          createdAt: format(
            new Date(measureData.createdAt),
            'dd MMMM yyyy, HH:mm'
          ),
          updatedAt: format(
            new Date(measureData.updatedAt),
            'dd MMMM yyyy, HH:mm'
          ),
        };

        res.status(200).json(formattedMeasure);
      } else {
        next(createError(404, 'Measure not found'));
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async createMeasure(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const body = req.body;

      const newMeasure = await Measure.create(body, {
        transaction: t,
        returning: true,
      });

      if (newMeasure) {
        const measureData = newMeasure.toJSON();

        const formattedNewMeasure = {
          ...measureData,
          description: measureData.description || '',
          createdAt: format(
            new Date(measureData.createdAt),
            'dd MMMM yyyy, HH:mm'
          ),
          updatedAt: format(
            new Date(measureData.updatedAt),
            'dd MMMM yyyy, HH:mm'
          ),
        };

        await t.commit();
        res.status(201).json(formattedNewMeasure);
      } else {
        await t.rollback();
        next(createError(400, 'Bad request'));
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
          createdAt: format(
            new Date(measureData.createdAt),
            'dd MMMM yyyy, HH:mm'
          ),
          updatedAt: format(
            new Date(measureData.updatedAt),
            'dd MMMM yyyy, HH:mm'
          ),
        };

        await t.commit();
        res.status(201).json(formattedUpdMeasure);
      } else {
        await t.rollback();
        next(createError(400, 'Bad request'));
      }
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      next(error);
    }
  }

  async deleteMeasure(req, res, next) {
    const t = await sequelize.transaction();

    const { measureId } = req.params;

    try {
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
        next(createError(400, 'Bad request'));
      }
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      next(error);
    }
  }
}

module.exports = new measureController();
