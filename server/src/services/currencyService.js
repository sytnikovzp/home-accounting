const { Currency } = require('../db/dbPostgres/models');
const { formatDate, checkPermission } = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/customErrors');

const formatCurrencyData = (currency) => ({
  id: currency.id,
  title: currency.title,
  description: currency.description || '',
  creation: {
    createdAt: formatDate(currency.createdAt),
    updatedAt: formatDate(currency.updatedAt),
  },
});

class CurrencyService {
  async getAllCurrencies(limit, offset, sort = 'id', order = 'asc') {
    const foundCurrencies = await Currency.findAll({
      attributes: ['id', 'title', 'description'],
      order: [[sort, order]],
      raw: true,
      limit,
      offset,
    });
    if (!foundCurrencies.length) throw notFound('Валюти не знайдено');
    const total = await Currency.count();
    return {
      allCurrencies: foundCurrencies.map(({ id, title, description }) => ({
        id,
        title,
        description: description || '',
      })),
      total,
    };
  }

  async getCurrencyById(currencyId) {
    const foundCurrency = await Currency.findByPk(currencyId);
    if (!foundCurrency) throw notFound('Валюту не знайдено');
    return formatCurrencyData(foundCurrency.toJSON());
  }

  async createCurrency(title, description, currentUser, transaction) {
    const canManageCurrencies = await checkPermission(
      currentUser,
      'MANAGE_CURRENCIES'
    );
    if (!canManageCurrencies)
      throw forbidden('Ви не маєте дозволу на створення валют');
    if (await Currency.findOne({ where: { title } }))
      throw badRequest('Ця валюта вже існує');
    const newCurrency = await Currency.create(
      {
        title,
        description: description || null,
        creatorId: currentUser.id.toString(),
        creatorFullName: currentUser.fullName,
      },
      { transaction, returning: true }
    );
    if (!newCurrency) throw badRequest('Дані цієї валюти не створено');
    return formatCurrencyData(newCurrency);
  }

  async updateCurrency(id, title, description, currentUser, transaction) {
    const foundCurrency = await Currency.findByPk(id);
    if (!foundCurrency) throw notFound('Валюту не знайдено');
    const canManageCurrencies = await checkPermission(
      currentUser,
      'MANAGE_CURRENCIES'
    );
    if (!canManageCurrencies)
      throw forbidden('Ви не маєте дозволу на редагування цієї валюти');
    if (title !== foundCurrency.title) {
      const duplicateCurrency = await Currency.findOne({ where: { title } });
      if (duplicateCurrency) throw badRequest('Ця валюта вже існує');
    }
    const updateData = {
      title,
      description: description || null,
    };
    const [affectedRows, [updatedCurrency]] = await Currency.update(
      updateData,
      { where: { id }, returning: true, transaction }
    );
    if (!affectedRows) throw badRequest('Дані цієї валюти не оновлено');
    return formatCurrencyData(updatedCurrency);
  }

  async deleteCurrency(currencyId, currentUser, transaction) {
    const canManageCurrencies = await checkPermission(
      currentUser,
      'MANAGE_CURRENCIES'
    );
    if (!canManageCurrencies)
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
