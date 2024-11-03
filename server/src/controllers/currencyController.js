const { sequelize } = require('../db/dbPostgres/models');
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
      res.status(200).json(allCurrencies);
    } catch (error) {
      console.log('Get all currencies error: ', error.message);
      next(error);
    }
  }

  async getCurrencyById(req, res, next) {
    try {
      const { currencyId } = req.params;
      const currency = await getCurrencyById(currencyId);
      res.status(200).json(currency);
    } catch (error) {
      console.log('Get currency by id error: ', error.message);
      next(error);
    }
  }

  async createCurrency(req, res, next) {
    const transaction = await sequelize.transaction();
    try {
      const { title, description } = req.body;
      const newCurrency = await createCurrency(title, description, transaction);
      await transaction.commit();
      res.status(201).json(newCurrency);
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
      const updatedCurrency = await updateCurrency(
        currencyId,
        title,
        description,
        transaction
      );
      await transaction.commit();
      res.status(200).json(updatedCurrency);
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
      await deleteCurrency(currencyId, transaction);
      await transaction.commit();
      res.sendStatus(res.statusCode);
    } catch (error) {
      await transaction.rollback();
      console.log('Delete currency error: ', error.message);
      next(error);
    }
  }
}

module.exports = new CurrencyController();
