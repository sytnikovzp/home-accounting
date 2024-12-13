const { parse } = require('date-fns');
const { uk } = require('date-fns/locale');
// ==============================================================
const {
  Purchase,
  Product,
  Shop,
  Measure,
  Currency,
} = require('../db/dbPostgres/models');
const {
  formatDate,
  isValidUUID,
  checkPermission,
  getRecordByTitle,
  formatDateTime,
} = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/generalErrors');

const formatPurchaseData = (purchase) => ({
  uuid: purchase.uuid,
  product: {
    uuid: purchase.Product?.uuid || '',
    title: purchase.Product?.title || '',
  },
  amount: purchase.amount,
  price: purchase.price,
  summ: purchase.summ,
  shop: {
    uuid: purchase.Shop?.uuid || '',
    title: purchase.Shop?.title || '',
  },
  measure: {
    uuid: purchase.Measure?.uuid || '',
    title: purchase.Measure?.title || '',
  },
  currency: {
    uuid: purchase.Currency?.uuid || '',
    title: purchase.Currency?.title || '',
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
  async getAllPurchases(limit, offset, sort, order) {
    const sortableFields = {
      product: [Product, 'title'],
      shop: [Shop, 'title'],
    };
    const orderConfig = sortableFields[sort]
      ? [...sortableFields[sort], order]
      : [['uuid', 'date'].includes(sort) ? sort : `Purchase.${sort}`, order];
    const foundPurchases = await Purchase.findAll({
      attributes: ['uuid', 'date'],
      include: [
        { model: Product, attributes: ['title'] },
        { model: Shop, attributes: ['title'] },
      ],
      order: [orderConfig],
      raw: true,
      limit,
      offset,
    });
    if (!foundPurchases.length) throw notFound('Покупки не знайдено');
    const total = await Purchase.count();
    return {
      allPurchases: foundPurchases.map(
        ({
          uuid,
          'Product.title': productTitle,
          'Shop.title': shopTitle,
          date,
        }) => ({
          uuid,
          product: productTitle || '',
          shop: shopTitle || '',
          date: formatDate(date),
        })
      ),
      total,
    };
  }

  async getPurchaseByUuid(uuid) {
    if (!isValidUUID(uuid)) throw badRequest('Невірний формат UUID');
    const foundPurchase = await Purchase.findByPk(uuid, {
      attributes: {
        exclude: ['productUuid', 'shopUuid', 'measureUuid', 'currencyUuid'],
      },
      include: [
        { model: Product, attributes: ['uuid', 'title'] },
        { model: Shop, attributes: ['uuid', 'title'] },
        { model: Measure, attributes: ['uuid', 'title'] },
        { model: Currency, attributes: ['uuid', 'title'] },
      ],
    });
    if (!foundPurchase) throw notFound('Покупку не знайдено');
    return formatPurchaseData(foundPurchase.toJSON());
  }

  async createPurchase(
    product,
    amountValue,
    priceValue,
    shop,
    measure,
    currency,
    dateValue,
    currentUser,
    transaction
  ) {
    const hasPermission = await checkPermission(currentUser, 'ADD_PURCHASES');
    if (!hasPermission)
      throw forbidden('Ви не маєте дозволу на створення покупок');
    const foundProduct = await getRecordByTitle(Product, product);
    if (!foundProduct) throw notFound('Товар не знайдено');
    const foundShop = await getRecordByTitle(Shop, shop);
    if (!foundShop) throw notFound('Магазин не знайдено');
    const foundMeasure = await getRecordByTitle(Measure, measure);
    if (!foundMeasure) throw notFound('Одиницю вимірювання не знайдено');
    const foundCurrency = await getRecordByTitle(Currency, currency);
    if (!foundCurrency) throw notFound('Валюту не знайдено');
    const amount = parseFloat(amountValue) || 0;
    const price = parseFloat(priceValue) || 0;
    const summ = amount * price || 0;
    let date = dateValue;
    if (dateValue) {
      date = parse(dateValue, 'dd MMMM yyyy', new Date(), { locale: uk });
      if (isNaN(date)) throw badRequest('Невірний формат дати');
    }
    const newPurchase = await Purchase.create(
      {
        productUuid: foundProduct.uuid,
        amount,
        price,
        summ,
        shopUuid: foundShop.uuid,
        measureUuid: foundMeasure.uuid,
        currencyUuid: foundCurrency.uuid,
        date,
        creatorUuid: currentUser.uuid,
        creatorFullName: currentUser.fullName,
      },
      { transaction, returning: true }
    );
    if (!newPurchase) throw badRequest('Дані цієї покупки не створено');
    return {
      uuid: newPurchase.uuid,
      product: {
        uuid: foundProduct.uuid,
        title: foundProduct.title,
      },
      amount: newPurchase.amount,
      price: newPurchase.price,
      summ: newPurchase.summ,
      shop: {
        uuid: foundShop.uuid,
        title: foundShop.title,
      },
      measure: {
        uuid: foundMeasure.uuid,
        title: foundMeasure.title,
      },
      currency: {
        uuid: foundCurrency.uuid,
        title: foundCurrency.title,
      },
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
    amountValue,
    priceValue,
    shop,
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
      throw forbidden('Ви не маєте дозволу на редагування цієї покупки');
    const foundProduct = await getRecordByTitle(Product, product);
    if (!foundProduct) throw notFound('Товар не знайдено');
    const foundShop = await getRecordByTitle(Shop, shop);
    if (!foundShop) throw notFound('Магазин не знайдено');
    const foundMeasure = await getRecordByTitle(Measure, measure);
    if (!foundMeasure) throw notFound('Одиницю вимірювання не знайдено');
    const foundCurrency = await getRecordByTitle(Currency, currency);
    if (!foundCurrency) throw notFound('Валюту не знайдено');
    const amount = amountValue
      ? parseFloat(amountValue) || 0
      : foundPurchase.amount;
    const price = priceValue
      ? parseFloat(priceValue) || 0
      : foundPurchase.price;
    const summ = amount * price || 0;
    let date = foundPurchase.date;
    if (dateValue) {
      date = parse(dateValue, 'dd MMMM yyyy', new Date(), { locale: uk });
      if (isNaN(date)) throw badRequest('Невірний формат дати');
    }
    const [affectedRows, [updatedPurchase]] = await Purchase.update(
      {
        productUuid: foundProduct.uuid,
        amount,
        price,
        summ,
        shopUuid: foundShop.uuid,
        measureUuid: foundMeasure.uuid,
        currencyUuid: foundCurrency.uuid,
        date,
      },
      { where: { uuid }, returning: true, transaction }
    );
    if (!affectedRows) throw badRequest('Дані цієї покупки не оновлено');
    return {
      uuid: updatedPurchase.uuid,
      product: {
        uuid: foundProduct.uuid,
        title: foundProduct.title,
      },
      amount: updatedPurchase.amount,
      price: updatedPurchase.price,
      summ: updatedPurchase.summ,
      shop: {
        uuid: foundShop.uuid,
        title: foundShop.title,
      },
      measure: {
        uuid: foundMeasure.uuid,
        title: foundMeasure.title,
      },
      currency: {
        uuid: foundCurrency.uuid,
        title: foundCurrency.title,
      },
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
      throw forbidden('Ви не маєте дозволу на видалення цієї покупки');
    const deletedPurchase = await Purchase.destroy({
      where: { uuid },
      transaction,
    });
    if (!deletedPurchase) throw badRequest('Дані цієї покупки не видалено');
    return deletedPurchase;
  }
}

module.exports = new PurchaseService();
