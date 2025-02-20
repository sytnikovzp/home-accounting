/* eslint-disable camelcase */
const { parse, isValid } = require('date-fns');
const { uk } = require('date-fns/locale');
const { Op } = require('sequelize');

const {
  Expense,
  Product,
  Establishment,
  Measure,
  Currency,
} = require('../db/dbPostgres/models');

const { notFound, badRequest, forbidden } = require('../errors/generalErrors');
const {
  formatDate,
  isValidUUID,
  checkPermission,
  getTime,
  getCurrencyByTitle,
  getRecordByTitle,
  formatDateTime,
  convertToUAH,
} = require('../utils/sharedFunctions');

const formatExpenseData = (expense) => ({
  uuid: expense.uuid,
  product: {
    uuid: expense.Product?.uuid || '',
    title: expense.Product?.title || '',
  },
  quantity: expense.quantity,
  unitPrice: expense.unitPrice,
  totalPrice: expense.totalPrice,
  establishment: {
    uuid: expense.Establishment?.uuid || '',
    title: expense.Establishment?.title || '',
  },
  measure: {
    uuid: expense.Measure?.uuid || '',
    title: expense.Measure?.title || '',
  },
  currency: {
    uuid: expense.Currency?.uuid || '',
    title: expense.Currency?.title || '',
    code: expense.Currency?.code || '',
  },
  date: formatDate(expense.date),
  creation: {
    creatorUuid: expense.creatorUuid,
    creatorFullName: expense.creatorFullName,
    createdAt: formatDateTime(expense.createdAt),
    updatedAt: formatDateTime(expense.updatedAt),
  },
});

class ExpensesService {
  static async getAllExpenses(currentUser, ago, limit, offset, sort, order) {
    const time = getTime(ago);
    const sortableFields = {
      product: [Product, 'title'],
      establishment: [Establishment, 'title'],
    };
    const orderConfig = sortableFields[sort]
      ? [...sortableFields[sort], order]
      : [['uuid', 'date'].includes(sort) ? sort : `Expense.${sort}`, order];
    const foundExpenses = await Expense.findAll({
      attributes: ['uuid', 'date', 'creator_uuid'],
      include: [
        { model: Product, attributes: ['title'] },
        { model: Establishment, attributes: ['title'] },
      ],
      where: { creator_uuid: currentUser.uuid, date: { [Op.gte]: time } },
      order: [orderConfig],
      raw: true,
      limit,
      offset,
    });
    if (!foundExpenses.length) {
      throw notFound('Витрати не знайдено');
    }
    const total = await Expense.count({
      where: { creator_uuid: currentUser.uuid, date: { [Op.gte]: time } },
    });
    return {
      allExpenses: foundExpenses.map(
        ({
          uuid,
          date,
          'Product.title': productTitle,
          'Establishment.title': establishmentTitle,
        }) => ({
          uuid,
          date: formatDate(date),
          product: productTitle || '',
          establishment: establishmentTitle || '',
        })
      ),
      total,
    };
  }

  static async getExpenseByUuid(uuid, currentUser) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundExpense = await Expense.findByPk(uuid, {
      attributes: {
        exclude: [
          'productUuid',
          'establishmentUuid',
          'measureUuid',
          'currencyUuid',
        ],
      },
      include: [
        { model: Product, attributes: ['uuid', 'title'] },
        { model: Establishment, attributes: ['uuid', 'title'] },
        { model: Measure, attributes: ['uuid', 'title'] },
        { model: Currency, attributes: ['uuid', 'title', 'code'] },
      ],
    });
    if (!foundExpense) {
      throw notFound('Витрату не знайдено');
    }
    if (foundExpense.creatorUuid !== currentUser.uuid) {
      throw forbidden('Ви не маєте дозволу на перегляд цієї витрати');
    }
    return formatExpenseData(foundExpense.toJSON());
  }

  static async createExpense(
    product,
    quantityValue,
    priceValue,
    establishment,
    measure,
    currency,
    dateValue,
    currentUser,
    transaction
  ) {
    const canManageExpenses = await checkPermission(
      currentUser,
      'ADD_EXPENSES'
    );
    if (!canManageExpenses) {
      throw forbidden('Ви не маєте дозволу на додавання витрат');
    }
    const [
      foundProduct,
      foundEstablishment,
      foundMeasure,
      foundCurrency,
      uahCurrency,
    ] = await Promise.all([
      getRecordByTitle(Product, product),
      getRecordByTitle(Establishment, establishment),
      getRecordByTitle(Measure, measure),
      getCurrencyByTitle(Currency, currency),
      getCurrencyByTitle(Currency, 'Українська гривня'),
    ]);
    if (
      !foundProduct ||
      !foundEstablishment ||
      !foundMeasure ||
      !foundCurrency ||
      !uahCurrency
    ) {
      throw notFound('Один або більше об`єктів не знайдено');
    }
    const quantity = parseFloat(quantityValue) || 0;
    let unitPrice = parseFloat(priceValue) || 0;
    if (foundCurrency.code !== 'UAH') {
      unitPrice = await convertToUAH(unitPrice, foundCurrency.code);
    }
    const date = dateValue
      ? parse(dateValue, 'dd MMMM yyyy', new Date(), { locale: uk })
      : null;
    if (dateValue && !isValid(date)) {
      throw badRequest('Невірний формат дати');
    }
    const newExpense = await Expense.create(
      {
        productUuid: foundProduct.uuid,
        quantity,
        unitPrice,
        establishmentUuid: foundEstablishment.uuid,
        measureUuid: foundMeasure.uuid,
        currencyUuid: uahCurrency.uuid,
        date,
        creatorUuid: currentUser.uuid,
        creatorFullName: currentUser.fullName,
      },
      { transaction, returning: true }
    );
    if (!newExpense) {
      throw badRequest('Дані цієї витрати не створено');
    }
    return {
      uuid: newExpense.uuid,
      product: { uuid: foundProduct.uuid, title: foundProduct.title },
      quantity: newExpense.quantity,
      unitPrice: newExpense.unitPrice,
      totalPrice: newExpense.totalPrice,
      establishment: {
        uuid: foundEstablishment.uuid,
        title: foundEstablishment.title,
      },
      measure: { uuid: foundMeasure.uuid, title: foundMeasure.title },
      currency: { uuid: uahCurrency.uuid, title: uahCurrency.title },
      date: formatDate(newExpense.date),
      creation: {
        creatorUuid: newExpense.creatorUuid,
        creatorFullName: newExpense.creatorFullName,
        createdAt: formatDateTime(newExpense.createdAt),
        updatedAt: formatDateTime(newExpense.updatedAt),
      },
    };
  }

  static async updateExpense(
    uuid,
    product,
    quantityValue,
    priceValue,
    establishment,
    measure,
    currency,
    dateValue,
    currentUser,
    transaction
  ) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundExpense = await Expense.findOne({ where: { uuid } });
    if (!foundExpense) {
      throw notFound('Витрату не знайдено');
    }
    const canEditExpenses =
      currentUser.uuid.toString() === foundExpense.creatorUuid &&
      (await checkPermission(currentUser, 'EDIT_EXPENSES'));
    if (!canEditExpenses) {
      throw forbidden('Ви не маєте дозволу на редагування цієї витрати');
    }
    const [
      foundProduct,
      foundEstablishment,
      foundMeasure,
      foundCurrency,
      uahCurrency,
    ] = await Promise.all([
      getRecordByTitle(Product, product),
      getRecordByTitle(Establishment, establishment),
      getRecordByTitle(Measure, measure),
      getCurrencyByTitle(Currency, currency),
      getCurrencyByTitle(Currency, 'Українська гривня'),
    ]);
    if (
      !foundProduct ||
      !foundEstablishment ||
      !foundMeasure ||
      !foundCurrency ||
      !uahCurrency
    ) {
      throw notFound('Один або більше об`єктів не знайдено');
    }
    const quantity = parseFloat(quantityValue) || 0;
    let unitPrice = parseFloat(priceValue) || 0;
    if (foundCurrency.code !== 'UAH') {
      unitPrice = await convertToUAH(unitPrice, foundCurrency.code);
    }
    let { date } = foundExpense;
    if (dateValue) {
      date = parse(dateValue, 'dd MMMM yyyy', new Date(), { locale: uk });
      if (!isValid(date)) {
        throw badRequest('Невірний формат дати');
      }
    }
    const [affectedRows, [updatedExpense]] = await Expense.update(
      {
        productUuid: foundProduct.uuid,
        quantity,
        unitPrice,
        establishmentUuid: foundEstablishment.uuid,
        measureUuid: foundMeasure.uuid,
        currencyUuid: uahCurrency.uuid,
        date,
      },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows) {
      throw badRequest('Дані цієї витрати не оновлено');
    }
    return {
      uuid: updatedExpense.uuid,
      product: { uuid: foundProduct.uuid, title: foundProduct.title },
      quantity: updatedExpense.quantity,
      unitPrice: updatedExpense.unitPrice,
      totalPrice: updatedExpense.totalPrice,
      establishment: {
        uuid: foundEstablishment.uuid,
        title: foundEstablishment.title,
      },
      measure: { uuid: foundMeasure.uuid, title: foundMeasure.title },
      currency: { uuid: uahCurrency.uuid, title: uahCurrency.title },
      date: formatDate(updatedExpense.date),
      creation: {
        creatorUuid: updatedExpense.creatorUuid,
        creatorFullName: updatedExpense.creatorFullName,
        createdAt: formatDateTime(updatedExpense.createdAt),
        updatedAt: formatDateTime(updatedExpense.updatedAt),
      },
    };
  }

  static async deleteExpense(uuid, currentUser, transaction) {
    if (!isValidUUID(uuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const foundExpense = await Expense.findOne({ where: { uuid } });
    if (!foundExpense) {
      throw notFound('Витрату не знайдено');
    }
    const canRemoveExpenses =
      currentUser.uuid.toString() === foundExpense.creatorUuid &&
      (await checkPermission(currentUser, 'REMOVE_EXPENSES'));
    if (!canRemoveExpenses) {
      throw forbidden('Ви не маєте дозволу на видалення цієї витрати');
    }
    const deletedExpense = await Expense.destroy({
      where: { uuid },
      transaction,
    });
    if (!deletedExpense) {
      throw badRequest('Дані цієї витрати не видалено');
    }
    return deletedExpense;
  }
}

module.exports = ExpensesService;
