const { sequelize } = require('../db/dbPostgres/models');

const {
  getAllCurrencies,
  getCurrencyByUuid,
  createCurrency,
  updateCurrency,
  deleteCurrency,
} = require('../services/currenciesService');
const { getCurrentUser } = require('../services/usersService');

class CurrenciesController {
  static async getAllCurrencies(req, res, next) {
    try {
      const {
        pagination: { limit, offset },
        query: { sort = 'uuid', order = 'asc' },
      } = req;
      const { allCurrencies, totalCount } = await getAllCurrencies(
        limit,
        offset,
        sort,
        order
      );
      if (allCurrencies.length > 0) {
        res.status(200).set('X-Total-Count', totalCount).json(allCurrencies);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get all currencies error: ', error.message);
      next(error);
    }
  }

  static async getCurrencyByUuid(req, res, next) {
    try {
      const {
        params: { currencyUuid },
      } = req;
      const currencyByUuid = await getCurrencyByUuid(currencyUuid);
      if (currencyByUuid) {
        res.status(200).json(currencyByUuid);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.error('Get currency by UUID error: ', error.message);
      next(error);
    }
  }

  static async createCurrency(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        body: { title, code },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
      const newCurrency = await createCurrency(
        title,
        code,
        currentUser,
        transaction
      );
      if (newCurrency) {
        await transaction.commit();
        res.status(201).json(newCurrency);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Create currency error: ', error.message);
      next(error);
    }
  }

  static async updateCurrency(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        params: { currencyUuid },
        body: { title, code },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
      const updatedCurrency = await updateCurrency(
        currencyUuid,
        title,
        code,
        currentUser,
        transaction
      );
      if (updatedCurrency) {
        await transaction.commit();
        res.status(200).json(updatedCurrency);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Update currency error: ', error.message);
      next(error);
    }
  }

  static async deleteCurrency(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const {
        params: { currencyUuid },
        user: { uuid },
      } = req;
      const currentUser = await getCurrentUser(uuid);
      const deletedCurrency = await deleteCurrency(
        currencyUuid,
        currentUser,
        transaction
      );
      if (deletedCurrency) {
        await transaction.commit();
        res.status(200).json('OK');
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.error('Delete currency error: ', error.message);
      next(error);
    }
  }
}

module.exports = CurrenciesController;
