const { sequelize } = require('../db/dbPostgres/models');
const { getCurrentUser } = require('../services/userService');
const {
  getAllCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
  deleteCurrency,
} = require('../services/currencyService');

class CurrencyController {
  async getAllCurrencies(req, res, next) {
    try {
      const allCurrencies = await getAllCurrencies();
      if (allCurrencies.length > 0) {
        res.status(200).json(allCurrencies);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.log('Get all currencies error: ', error.message);
      next(error);
    }
  }

  async getCurrencyById(req, res, next) {
    try {
      const { currencyId } = req.params;
      const currency = await getCurrencyById(currencyId);
      if (currency) {
        res.status(200).json(currency);
      } else {
        res.status(401);
      }
    } catch (error) {
      console.log('Get currency by id error: ', error.message);
      next(error);
    }
  }

  async createCurrency(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { title, description } = req.body;
      const currentUser = await getCurrentUser(req.user.email);
      const newCurrency = await createCurrency(
        title,
        description,
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
      const { currencyId } = req.params;
      const { title, description } = req.body;
      const currentUser = await getCurrentUser(req.user.email);
      const updatedCurrency = await updateCurrency(
        currencyId,
        title,
        description,
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
      const { currencyId } = req.params;
      const currentUser = await getCurrentUser(req.user.email);
      const deletedCurrency = await deleteCurrency(
        currencyId,
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
