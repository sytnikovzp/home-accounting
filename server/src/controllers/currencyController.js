const createError = require('http-errors');
const { format } = require('date-fns');
// ====================================================
const { Currency, sequelize } = require('../db/dbPostgres/models');

class CurrencyController {
  async getAllCurrencies(req, res, next) {
    try {
      const allCurrencies = await Currency.findAll({
        attributes: ['id', 'title'],
        raw: true,
      });

      if (allCurrencies.length > 0) {
        res.status(200).json(allCurrencies);
      } else {
        next(createError(404, 'Currencies not found'));
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async getCurrencyById(req, res, next) {
    try {
      const { currencyId } = req.params;

      const currencyById = await Currency.findByPk(currencyId);

      if (currencyById) {
        const currencyData = currencyById.toJSON();

        const formattedCurrency = {
          ...currencyData,
          description: currencyData.description || '',
          createdAt: format(
            new Date(currencyData.createdAt),
            'dd MMMM yyyy, HH:mm'
          ),
          updatedAt: format(
            new Date(currencyData.updatedAt),
            'dd MMMM yyyy, HH:mm'
          ),
        };

        res.status(200).json(formattedCurrency);
      } else {
        next(createError(404, 'Currency not found'));
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async createCurrency(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { title, description: descriptionValue } = req.body;

      const description = descriptionValue === '' ? null : descriptionValue;

      const newBody = { title, description };

      const newCurrency = await Currency.create(newBody, {
        transaction: t,
        returning: true,
      });

      if (newCurrency) {
        const currencyData = newCurrency.toJSON();

        const formattedNewCurrency = {
          ...currencyData,
          description: currencyData.description || '',
          createdAt: format(
            new Date(currencyData.createdAt),
            'dd MMMM yyyy, HH:mm'
          ),
          updatedAt: format(
            new Date(currencyData.updatedAt),
            'dd MMMM yyyy, HH:mm'
          ),
        };

        await t.commit();
        res.status(201).json(formattedNewCurrency);
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

  async updateCurrency(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { id, title, description: descriptionValue } = req.body;

      const description = descriptionValue === '' ? null : descriptionValue;

      const newBody = { title, description };

      const [affectedRows, [updatedCurrency]] = await Currency.update(newBody, {
        where: { id },
        returning: true,
        transaction: t,
      });

      if (affectedRows > 0) {
        const currencyData = updatedCurrency.toJSON();

        const formattedUpdCurrency = {
          ...currencyData,
          description: currencyData.description || '',
          createdAt: format(
            new Date(currencyData.createdAt),
            'dd MMMM yyyy, HH:mm'
          ),
          updatedAt: format(
            new Date(currencyData.updatedAt),
            'dd MMMM yyyy, HH:mm'
          ),
        };

        await t.commit();
        res.status(200).json(formattedUpdCurrency);
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

  async deleteCurrency(req, res, next) {
    const t = await sequelize.transaction();

    try {
      const { currencyId } = req.params;

      const deleteCurrency = await Currency.destroy({
        where: {
          id: currencyId,
        },
        transaction: t,
      });

      if (deleteCurrency) {
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

module.exports = new CurrencyController();
