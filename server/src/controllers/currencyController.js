const { sequelize } = require('../db/dbPostgres/models');
const { getCurrentUser } = require('../services/userService');
const {
  getAllCurrencies,
  getCurrencyByUuid,
  createCurrency,
  updateCurrency,
  deleteCurrency,
} = require('../services/currencyService');

class CurrencyController {
  async getAllCurrencies(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const { sort = 'uuid', order = 'asc' } = req.query;
      const { allCurrencies, total } = await getAllCurrencies(
        limit,
        offset,
        sort,
        order
      );
      if (allCurrencies.length > 0) {
        res.status(200).set('X-Total-Count', total).json(allCurrencies);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.log('Get all currencies error: ', error.message);
      next(error);
    }
  }

  async getCurrencyByUuid(req, res, next) {
    try {
      const { currencyUuid } = req.params;
      const currency = await getCurrencyByUuid(currencyUuid);
      if (currency) {
        res.status(200).json(currency);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.log('Get currency by uuid error: ', error.message);
      next(error);
    }
  }

  async createCurrency(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { title, code } = req.body;
      const currentUser = await getCurrentUser(req.user.email);
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
      console.log('Create currency error: ', error.message);
      next(error);
    }
  }

  async updateCurrency(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { currencyUuid } = req.params;
      const { title, code } = req.body;
      const currentUser = await getCurrentUser(req.user.email);
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
      console.log('Update currency error: ', error.message);
      next(error);
    }
  }

  async deleteCurrency(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { currencyUuid } = req.params;
      const currentUser = await getCurrentUser(req.user.email);
      const deletedCurrency = await deleteCurrency(
        currencyUuid,
        currentUser,
        transaction
      );
      if (deletedCurrency) {
        await transaction.commit();
        res.sendStatus(res.statusCode);
      } else {
        await transaction.rollback();
        res.status(401);
      }
    } catch (error) {
      await transaction.rollback();
      console.log('Delete currency error: ', error.message);
      next(error);
    }
  }
}

module.exports = new CurrencyController();
