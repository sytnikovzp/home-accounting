const {
  Purchase,
  Product,
  Shop,
  Measure,
  Currency,
} = require('../db/dbPostgres/models');
const {
  formatDate,
  checkPermission,
  getRecordByTitle,
} = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/customErrors');

const formatPurchaseData = (purchase) => ({
  id: purchase.id,
  product: purchase.Product?.title || '',
  amount: purchase.amount,
  price: purchase.price,
  summ: purchase.summ,
  shop: purchase.Shop?.title || '',
  measure: purchase.Measure?.title || '',
  currency: purchase.Currency?.title || '',
  creation: {
    creatorId: purchase.creatorId,
    creatorFullName: purchase.creatorFullName,
    createdAt: formatDate(purchase.createdAt),
    updatedAt: formatDate(purchase.updatedAt),
  },
});

class PurchaseService {
  async getAllPurchases(limit, offset, sort = 'id', order = 'asc') {
    const sortableFields = {
      product: [Product, 'title'],
      shop: [Shop, 'title'],
      measure: [Measure, 'title'],
      currency: [Currency, 'title'],
    };
    const orderConfig = sortableFields[sort]
      ? [...sortableFields[sort], order]
      : [
          ['id', 'amount', 'price', 'summ', 'creatorId', 'createdAt'].includes(
            sort
          )
            ? sort
            : `Purchase.${sort}`,
          order,
        ];
    const foundPurchases = await Purchase.findAll({
      attributes: [
        'id',
        'amount',
        'price',
        'summ',
        'creatorId',
        'creatorFullName',
        'createdAt',
      ],
      include: [
        { model: Product, attributes: ['title'] },
        { model: Shop, attributes: ['title'] },
        { model: Measure, attributes: ['title'] },
        { model: Currency, attributes: ['title'] },
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
          id,
          amount,
          price,
          summ,
          'Product.title': productTitle,
          'Shop.title': shopTitle,
          'Measure.title': measureTitle,
          'Currency.title': currencyTitle,
          creatorId,
          creatorFullName,
          createdAt,
        }) => ({
          id,
          product: productTitle || '',
          amount,
          price,
          summ,
          shop: shopTitle || '',
          measure: measureTitle || '',
          currency: currencyTitle || '',
          creation: {
            creatorId,
            creatorFullName,
            createdAt: formatDate(createdAt),
          },
        })
      ),
      total,
    };
  }

  async getPurchaseById(purchaseId) {
    const foundPurchase = await Purchase.findByPk(purchaseId, {
      attributes: {
        exclude: ['productId', 'shopId', 'measureId', 'currencyId'],
      },
      include: [
        { model: Product, attributes: ['title'] },
        { model: Shop, attributes: ['title'] },
        { model: Measure, attributes: ['title'] },
        { model: Currency, attributes: ['title'] },
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
    const newPurchase = await Purchase.create(
      {
        productId: foundProduct.id,
        amount,
        price,
        summ,
        shopId: foundShop.id,
        measureId: foundMeasure.id,
        currencyId: foundCurrency.id,
        creatorId: currentUser.id.toString(),
        creatorFullName: currentUser.fullName,
      },
      { transaction, returning: true }
    );
    if (!newPurchase) throw badRequest('Дані цієї покупки не створено');
    return {
      id: newPurchase.id,
      product: foundProduct.title,
      amount: newPurchase.amount,
      price: newPurchase.price,
      summ: newPurchase.summ,
      shop: foundShop.title,
      measure: foundMeasure.title,
      currency: foundCurrency.title,
      creation: {
        creatorId: newPurchase.creatorId,
        creatorFullName: newPurchase.creatorFullName,
        createdAt: formatDate(newPurchase.createdAt),
        updatedAt: formatDate(newPurchase.updatedAt),
      },
    };
  }

  async updatePurchase(
    id,
    product,
    amountValue,
    priceValue,
    shop,
    measure,
    currency,
    currentUser,
    transaction
  ) {
    const foundPurchase = await Purchase.findByPk(id);
    if (!foundPurchase) throw notFound('Покупку не знайдено');
    const isOwner = currentUser.id.toString() === foundPurchase.creatorId;
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
    const [affectedRows, [updatedPurchase]] = await Purchase.update(
      {
        productId: foundProduct.id,
        amount,
        price,
        summ,
        shopId: foundShop.id,
        measureId: foundMeasure.id,
        currencyId: foundCurrency.id,
      },
      { where: { id }, returning: true, transaction }
    );
    if (!affectedRows) throw badRequest('Дані цієї покупки не оновлено');
    return {
      id: updatedPurchase.id,
      product: foundProduct.title,
      amount: updatedPurchase.amount,
      price: updatedPurchase.price,
      summ: updatedPurchase.summ,
      shop: foundShop.title,
      measure: foundMeasure.title,
      currency: foundCurrency.title,
      creation: {
        creatorId: updatedPurchase.creatorId,
        creatorFullName: updatedPurchase.creatorFullName,
        createdAt: formatDate(updatedPurchase.createdAt),
        updatedAt: formatDate(updatedPurchase.updatedAt),
      },
    };
  }

  async deletePurchase(purchaseId, currentUser, transaction) {
    const foundPurchase = await Purchase.findByPk(purchaseId);
    if (!foundPurchase) throw notFound('Покупку не знайдено');
    const isOwner = currentUser.id.toString() === foundPurchase.creatorId;
    if (!isOwner)
      throw forbidden('Ви не маєте дозволу на видалення цієї покупки');
    const deletedPurchase = await Purchase.destroy({
      where: { id: purchaseId },
      transaction,
    });
    if (!deletedPurchase) throw badRequest('Дані цієї покупки не видалено');
    return deletedPurchase;
  }
}

module.exports = new PurchaseService();
