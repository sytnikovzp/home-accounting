/* eslint-disable camelcase */
const { parse, isValid } = require('date-fns');
const { uk } = require('date-fns/locale');
const { Op } = require('sequelize');
// ==============================================================
const {
  Purchase,
  Product,
  Establishment,
  Measure,
  Currency,
} = require('../db/dbPostgres/models');
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
const { notFound, badRequest, forbidden } = require('../errors/generalErrors');

const formatPurchaseData = (purchase) => ({
  uuid: purchase.uuid,
  product: {
    uuid: purchase.Product?.uuid || '',
    title: purchase.Product?.title || '',
  },
  quantity: purchase.quantity,
  unitPrice: purchase.unitPrice,
  totalPrice: purchase.totalPrice,
  establishment: {
    uuid: purchase.Establishment?.uuid || '',
    title: purchase.Establishment?.title || '',
  },
  measure: {
    uuid: purchase.Measure?.uuid || '',
    title: purchase.Measure?.title || '',
  },
  currency: {
    uuid: purchase.Currency?.uuid || '',
    title: purchase.Currency?.title || '',
    code: purchase.Currency?.code || '',
  },
  date: formatDate(purchase.date),
  creation: {
    creatorUuid: purchase.creatorUuid,
    creatorFullName: purchase.creatorFullName,
    createdAt: formatDateTime(purchase.createdAt),
    updatedAt: formatDateTime(purchase.updatedAt),
  },
});

class PurchaseService {
  async getAllPurchases(currentUser, ago, limit, offset, sort, order) {
    const time = getTime(ago);
    const sortableFields = {
      product: [Product, 'title'],
      establishment: [Establishment, 'title'],
    };
    const orderConfig = sortableFields[sort]
      ? [...sortableFields[sort], order]
      : [['uuid', 'date'].includes(sort) ? sort : `Purchase.${sort}`, order];
    const foundPurchases = await Purchase.findAll({
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
    if (!foundPurchases.length) throw notFound('Витрати не знайдено');
    const total = await Purchase.count({
      where: { creator_uuid: currentUser.uuid, date: { [Op.gte]: time } },
    });
    return {
      allPurchases: foundPurchases.map(
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

  async getPurchaseByUuid(uuid, currentUser) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const foundPurchase = await Purchase.findByPk(uuid, {
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
    if (!foundPurchase) throw notFound('Покупку не знайдено');
    if (foundPurchase.creatorUuid !== currentUser.uuid)
      throw forbidden('У Вас немає дозволу на перегляд цієї витрати');
    return formatPurchaseData(foundPurchase.toJSON());
  }

  async createPurchase(
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
    const hasPermission = await checkPermission(currentUser, 'ADD_PURCHASES');
    if (!hasPermission)
      throw forbidden('Ви не маєте дозволу на створення витрат');
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
    )
      throw notFound('Один або більше об`єктів не знайдено');
    const quantity = parseFloat(quantityValue) || 0;
    let unitPrice = parseFloat(priceValue) || 0;
    if (foundCurrency.code !== 'UAH') {
      unitPrice = await convertToUAH(unitPrice, foundCurrency.code);
    }
    const date = dateValue
      ? parse(dateValue, 'dd MMMM yyyy', new Date(), { locale: uk })
      : null;
    if (dateValue && !isValid(date)) throw badRequest('Невірний формат дати');
    const newPurchase = await Purchase.create(
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
    if (!newPurchase) throw badRequest('Дані цієї витрати не створено');
    return {
      uuid: newPurchase.uuid,
      product: { uuid: foundProduct.uuid, title: foundProduct.title },
      quantity: newPurchase.quantity,
      unitPrice: newPurchase.unitPrice,
      totalPrice: newPurchase.totalPrice,
      establishment: {
        uuid: foundEstablishment.uuid,
        title: foundEstablishment.title,
      },
      measure: { uuid: foundMeasure.uuid, title: foundMeasure.title },
      currency: { uuid: uahCurrency.uuid, title: uahCurrency.title },
      date: formatDate(newPurchase.date),
      creation: {
        creatorUuid: newPurchase.creatorUuid,
        creatorFullName: newPurchase.creatorFullName,
        createdAt: formatDateTime(newPurchase.createdAt),
        updatedAt: formatDateTime(newPurchase.updatedAt),
      },
    };
  }

  async updatePurchase(
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
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const foundPurchase = await Purchase.findOne({ where: { uuid } });
    if (!foundPurchase) throw notFound('Покупку не знайдено');
    const isOwner = currentUser.uuid.toString() === foundPurchase.creatorUuid;
    if (!isOwner)
      throw forbidden('Ви не маєте дозволу на редагування цієї витрати');
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
    )
      throw notFound('Один або більше об`єктів не знайдено');
    const quantity = parseFloat(quantityValue) || 0;
    let unitPrice = parseFloat(priceValue) || 0;
    if (foundCurrency.code !== 'UAH') {
      unitPrice = await convertToUAH(unitPrice, foundCurrency.code);
    }
    let date = foundPurchase.date;
    if (dateValue) {
      date = parse(dateValue, 'dd MMMM yyyy', new Date(), { locale: uk });
      if (!isValid(date)) throw badRequest('Невірний формат дати');
    }
    const [affectedRows, [updatedPurchase]] = await Purchase.update(
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
    if (!affectedRows) throw badRequest('Дані цієї витрати не оновлено');
    return {
      uuid: updatedPurchase.uuid,
      product: { uuid: foundProduct.uuid, title: foundProduct.title },
      quantity: updatedPurchase.quantity,
      unitPrice: updatedPurchase.unitPrice,
      totalPrice: updatedPurchase.totalPrice,
      establishment: {
        uuid: foundEstablishment.uuid,
        title: foundEstablishment.title,
      },
      measure: { uuid: foundMeasure.uuid, title: foundMeasure.title },
      currency: { uuid: uahCurrency.uuid, title: uahCurrency.title },
      date: formatDate(updatedPurchase.date),
      creation: {
        creatorUuid: updatedPurchase.creatorUuid,
        creatorFullName: updatedPurchase.creatorFullName,
        createdAt: formatDateTime(updatedPurchase.createdAt),
        updatedAt: formatDateTime(updatedPurchase.updatedAt),
      },
    };
  }

  async deletePurchase(uuid, currentUser, transaction) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const foundPurchase = await Purchase.findOne({ where: { uuid } });
    if (!foundPurchase) throw notFound('Покупку не знайдено');
    const isOwner = currentUser.uuid.toString() === foundPurchase.creatorUuid;
    if (!isOwner)
      throw forbidden('Ви не маєте дозволу на видалення цієї витрати');
    const deletedPurchase = await Purchase.destroy({
      where: { uuid },
      transaction,
    });
    if (!deletedPurchase) throw badRequest('Дані цієї витрати не видалено');
    return deletedPurchase;
  }
}

module.exports = new PurchaseService();
