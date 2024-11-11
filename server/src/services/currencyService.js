const { Currency } = require('../db/dbPostgres/models');
const { formatDate, checkPermission } = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/customErrors');

class CurrencyService {
  async getAllCurrencies() {
    const foundCurrencies = await Currency.findAll({
      attributes: ['id', 'title'],
      raw: true,
    });
    if (foundCurrencies.length === 0) throw notFound('Currencies not found');
    return foundCurrencies;
  }

  async getCurrencyById(currencyId) {
    const foundCurrency = await Currency.findByPk(currencyId);
    if (!foundCurrency) throw notFound('Currency not found');
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
      throw forbidden('You don`t have permission to create currencies');
    const duplicateCurrency = await Currency.findOne({ where: { title } });
    if (duplicateCurrency) throw badRequest('This currency already exists');
    const description = descriptionValue === '' ? null : descriptionValue;
    const newCurrency = await Currency.create(
      { title, description },
      { transaction, returning: true }
    );
    if (!newCurrency) throw badRequest('Currency is not created');
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
      throw forbidden('You don`t have permission to edit this currency');
    const foundCurrency = await Currency.findByPk(id);
    if (!foundCurrency) throw notFound('Currency not found');
    const currentTitle = foundCurrency.title;
    if (title !== currentTitle) {
      const duplicateCurrency = await Currency.findOne({ where: { title } });
      if (duplicateCurrency) throw badRequest('This currency already exists');
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
    if (affectedRows === 0) throw badRequest('Currency is not updated');
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
      throw forbidden('You don`t have permission to delete this currency');
    const foundCurrency = await Currency.findByPk(currencyId);
    if (!foundCurrency) throw notFound('Currency not found');
    const deletedCurrency = await Currency.destroy({
      where: { id: currencyId },
      transaction,
    });
    if (!deletedCurrency) throw badRequest('Currency is not deleted');
    return deletedCurrency;
  }
}

module.exports = new CurrencyService();
