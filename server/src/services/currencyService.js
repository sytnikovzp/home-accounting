const { Currency } = require('../db/dbPostgres/models');
const { notFound, badRequest } = require('../errors/customErrors');
const { formatDate } = require('../utils/sharedFunctions');

class CurrencyService {
  async getAllCurrencies() {
    const allCurrencies = await Currency.findAll({
      attributes: ['id', 'title'],
      raw: true,
    });
    if (allCurrencies.length === 0) {
      throw notFound('Currencies not found');
    }
    return allCurrencies;
  }

  async getCurrencyById(currencyId) {
    const currencyById = await Currency.findByPk(currencyId);
    if (!currencyById) {
      throw notFound('Currency not found');
    }
    const currencyData = currencyById.toJSON();
    return {
      ...currencyData,
      description: currencyData.description || '',
      createdAt: formatDate(currencyData.createdAt),
      updatedAt: formatDate(currencyData.updatedAt),
    };
  }

  async createCurrency(title, descriptionValue, transaction) {
    const existingCurrency = await Currency.findOne({ where: { title } });
    if (existingCurrency) {
      throw badRequest('This currency already exists');
    }
    const description = descriptionValue === '' ? null : descriptionValue;
    const newCurrency = await Currency.create(
      { title, description },
      { transaction }
    );
    return {
      id: newCurrency.id,
      title: newCurrency.title,
      description: newCurrency.description || '',
    };
  }

  async updateCurrency(id, title, descriptionValue, transaction) {
    const currencyById = await Currency.findByPk(id);
    if (!currencyById) {
      throw notFound('Currency not found');
    }
    const currentTitle = currencyById.title;
    if (title !== currentTitle) {
      const existingCurrency = await Currency.findOne({ where: { title } });
      if (existingCurrency) {
        throw badRequest('This currency already exists');
      }
    } else {
      title = currentTitle;
    }
    const updateData = { title };
    if (descriptionValue !== undefined) {
      const description = descriptionValue === '' ? null : descriptionValue;
      updateData.description = description;
    }
    const [affectedRows, [updatedCurrency]] = await Currency.update(
      updateData,
      { where: { id }, returning: true, transaction }
    );
    if (affectedRows === 0) {
      throw badRequest('Currency is not updated');
    }
    return {
      id: updatedCurrency.id,
      title: updatedCurrency.title,
      description: updatedCurrency.description || '',
    };
  }

  async deleteCurrency(currencyId, transaction) {
    const currencyById = await Currency.findByPk(currencyId);
    if (!currencyById) {
      throw notFound('Currency not found');
    }
    const deleteCurrency = await Currency.destroy({
      where: { id: currencyId },
      transaction,
    });
    if (!deleteCurrency) {
      throw badRequest('Currency is not deleted');
    }
    return deleteCurrency;
  }
}

module.exports = new CurrencyService();
