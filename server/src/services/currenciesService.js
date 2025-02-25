const { Op } = require('sequelize');

const { Currency } = require('../db/dbPostgres/models');

const { notFound, badRequest, forbidden } = require('../errors/generalErrors');
const {
  formatDateTime,
  isValidUUID,
  checkPermission,
} = require('../utils/sharedFunctions');

const formatCurrencyData = (currency) => ({
  uuid: currency.uuid,
  title: currency.title,
  code: currency.code,
  creation: {
    creatorUuid: currency.creatorUuid || '',
    creatorFullName: currency.creatorFullName || '',
    createdAt: formatDateTime(currency.createdAt),
    updatedAt: formatDateTime(currency.updatedAt),
  },
});

class CurrenciesService {
  static async getAllCurrencies(limit, offset, sort, order) {
    const foundCurrencies = await Currency.findAll({
      attributes: ['uuid', 'title', 'code'],
      order: [[sort, order]],
      raw: true,
      limit,
      offset,
    });
    if (!foundCurrencies.length) {
      throw notFound('Валюти не знайдено');
    }
    const totalCount = await Currency.count();
    return {
      allCurrencies: foundCurrencies.map(({ uuid, title, code }) => ({
        uuid,
        title,
        code,
      })),
      totalCount,
    };
  }

  static async getCurrencyByUuid(uuid) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundCurrency = await Currency.findOne({
      where: { uuid },
    });
    if (!foundCurrency) {
      throw notFound('Валюту не знайдено');
    }
    return formatCurrencyData(foundCurrency);
  }

  static async createCurrency(title, code, currentUser, transaction) {
    if (
      await Currency.findOne({
        where: {
          [Op.or]: [{ title }, { code }],
        },
      })
    ) {
      throw badRequest('Ця валюта вже існує');
    }
    const canAddCurrencies = await checkPermission(
      currentUser,
      'ADD_CURRENCIES'
    );
    if (!canAddCurrencies) {
      throw forbidden('Ви не маєте дозволу на додавання валют');
    }
    const newCurrency = await Currency.create(
      {
        title,
        code,
        creatorUuid: currentUser.uuid,
        creatorFullName: currentUser.fullName,
      },
      { transaction, returning: true }
    );
    if (!newCurrency) {
      throw badRequest('Дані цієї валюти не створено');
    }
    return formatCurrencyData(newCurrency);
  }

  static async updateCurrency(uuid, title, code, currentUser, transaction) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundCurrency = await Currency.findOne({ where: { uuid } });
    if (!foundCurrency) {
      throw notFound('Валюту не знайдено');
    }
    const canEditCurrencies = await checkPermission(
      currentUser,
      'EDIT_CURRENCIES'
    );
    if (!canEditCurrencies) {
      throw forbidden('Ви не маєте дозволу на редагування цієї валюти');
    }
    if (
      foundCurrency.title === 'Українська гривня' ||
      foundCurrency.code === 'UAH'
    ) {
      throw forbidden('Не можна редагувати Державну Валюту');
    }
    if (title && title !== foundCurrency.title) {
      const duplicateCurrency = await Currency.findOne({ where: { title } });
      if (duplicateCurrency) {
        throw badRequest('Ця валюта вже існує');
      }
    }
    if (code && code !== foundCurrency.code) {
      const duplicateCurrency = await Currency.findOne({ where: { code } });
      if (duplicateCurrency) {
        throw badRequest('Ця валюта вже існує');
      }
    }
    const [affectedRows, [updatedCurrency]] = await Currency.update(
      { title, code },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows) {
      throw badRequest('Дані цієї валюти не оновлено');
    }
    return formatCurrencyData(updatedCurrency);
  }

  static async deleteCurrency(uuid, currentUser, transaction) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundCurrency = await Currency.findOne({ where: { uuid } });
    if (!foundCurrency) {
      throw notFound('Валюту не знайдено');
    }
    const canRemoveCurrencies = await checkPermission(
      currentUser,
      'REMOVE_CURRENCIES'
    );
    if (!canRemoveCurrencies) {
      throw forbidden('Ви не маєте дозволу на видалення цієї валюти');
    }
    if (
      foundCurrency.title === 'Українська гривня' ||
      foundCurrency.code === 'UAH'
    ) {
      throw forbidden('Не можна видалити Державну Валюту');
    }
    const deletedCurrency = await Currency.destroy({
      where: { uuid },
      transaction,
    });
    if (!deletedCurrency) {
      throw badRequest('Дані цієї валюти не видалено');
    }
    return deletedCurrency;
  }
}

module.exports = CurrenciesService;
