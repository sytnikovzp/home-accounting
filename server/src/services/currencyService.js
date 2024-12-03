const { Currency } = require('../db/dbPostgres/models');
const { formatDate, checkPermission } = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/customErrors');

class CurrencyService {
  async getAllCurrencies(limit, offset) {
    const foundCurrencies = await Currency.findAll({
      attributes: ['id', 'title', 'description'],
      raw: true,
      limit,
      offset,
    });
    if (foundCurrencies.length === 0) throw notFound('Валюти не знайдено');
    const allCurrencies = foundCurrencies.map((currency) => ({
      id: currency.id,
      title: currency.title,
      description: currency.description || '',
    }));
    const total = await Currency.count();
    return {
      allCurrencies,
      total,
    };
  }

  async getCurrencyById(currencyId) {
    const foundCurrency = await Currency.findByPk(currencyId);
    if (!foundCurrency) throw notFound('Валюту не знайдено');
    const currencyData = foundCurrency.toJSON();
    return {
      ...currencyData,
      description: currencyData.description || '',
      createdAt: formatDate(currencyData.createdAt),
      updatedAt: formatDate(currencyData.updatedAt),
    };
  }

  async createCurrency(title, descriptionValue, currentUser, transaction) {
    const hasPermission = await checkPermission(
      currentUser,
      'MANAGE_CURRENCIES'
    );
    if (!hasPermission)
      throw forbidden('Ви не маєте дозволу на створення валют');
    const duplicateCurrency = await Currency.findOne({ where: { title } });
    if (duplicateCurrency) throw badRequest('Ця валюта вже існує');
    const description = descriptionValue === '' ? null : descriptionValue;
    const newCurrency = await Currency.create(
      { title, description },
      { transaction, returning: true }
    );
    if (!newCurrency) throw badRequest('Дані цієї валюти не створено');
    return {
      id: newCurrency.id,
      title: newCurrency.title,
      description: newCurrency.description || '',
    };
  }

  async updateCurrency(id, title, descriptionValue, currentUser, transaction) {
    const hasPermission = await checkPermission(
      currentUser,
      'MANAGE_CURRENCIES'
    );
    if (!hasPermission)
      throw forbidden('Ви не маєте дозволу на редагування цієї валюти');
    const foundCurrency = await Currency.findByPk(id);
    if (!foundCurrency) throw notFound('Валюту не знайдено');
    const currentTitle = foundCurrency.title;
    if (title !== currentTitle) {
      const duplicateCurrency = await Currency.findOne({ where: { title } });
      if (duplicateCurrency) throw badRequest('Ця валюта вже існує');
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
    if (!affectedRows) throw badRequest('Дані цієї валюти не оновлено');
    return {
      id: updatedCurrency.id,
      title: updatedCurrency.title,
      description: updatedCurrency.description || '',
    };
  }

  async deleteCurrency(currencyId, currentUser, transaction) {
    const hasPermission = await checkPermission(
      currentUser,
      'MANAGE_CURRENCIES'
    );
    if (!hasPermission)
      throw forbidden('Ви не маєте дозволу на видалення цієї валюти');
    const foundCurrency = await Currency.findByPk(currencyId);
    if (!foundCurrency) throw notFound('Валюту не знайдено');
    const deletedCurrency = await Currency.destroy({
      where: { id: currencyId },
      transaction,
    });
    if (!deletedCurrency) throw badRequest('Дані цієї валюти не видалено');
    return deletedCurrency;
  }
}

module.exports = new CurrencyService();
