const {
  Purchase,
  Product,
  Shop,
  Measure,
  Currency,
} = require('../db/dbPostgres/models');
const {
  formatDate,
  getRecordByTitle,
  checkPermission,
} = require('../utils/sharedFunctions');
const { notFound, badRequest, forbidden } = require('../errors/customErrors');

class PurchaseService {
  async getAllPurchases(limit, offset) {
    const foundPurchases = await Purchase.findAll({
      attributes: ['id', 'amount', 'price', 'summ'],
      include: [
        { model: Product, attributes: ['title'] },
        { model: Shop, attributes: ['title'] },
        { model: Measure, attributes: ['title'] },
        { model: Currency, attributes: ['title'] },
      ],
      raw: true,
      limit,
      offset,
    });
    if (foundPurchases.length === 0) throw notFound('Покупки не знайдено');
    const allPurchases = foundPurchases.map((purchase) => ({
      id: purchase.id,
      product: purchase['Product.title'] || '',
      amount: purchase.amount,
      price: purchase.price,
      summ: purchase.summ,
      shop: purchase['Shop.title'] || '',
      measure: purchase['Measure.title'] || '',
      currency: purchase['Currency.title'] || '',
    }));
    const total = await Purchase.count();
    return {
      allPurchases,
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
    if (!foundPurchase) throw notFound('Покупка не знайдена');
    const purchaseData = foundPurchase.toJSON();
    return {
      id: purchaseData.id,
      product: purchaseData.Product.title,
      amount: purchaseData.amount,
      price: purchaseData.price,
      summ: purchaseData.summ,
      shop: purchaseData.Shop.title,
      measure: purchaseData.Measure.title,
      currency: purchaseData.Currency.title,
      createdBy: purchaseData.createdBy || '',
      createdAt: formatDate(purchaseData.createdAt),
      updatedAt: formatDate(purchaseData.updatedAt),
    };
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
    if (!foundMeasure) throw notFound('Одиниця вимірювання не знайдена');
    const foundCurrency = await getRecordByTitle(Currency, currency);
    if (!foundCurrency) throw notFound('Валюта не знайдена');
    const amount = parseFloat(amountValue) || 0;
    const price = parseFloat(priceValue) || 0;
    const summ = parseFloat(amountValue) * parseFloat(priceValue) || 0;
    const createdBy = currentUser.id.toString();
    const newPurchaseData = {
      productId: foundProduct.id,
      amount,
      price,
      summ,
      shopId: foundShop.id,
      measureId: foundMeasure.id,
      currencyId: foundCurrency.id,
      createdBy,
    };
    const newPurchase = await Purchase.create(newPurchaseData, {
      transaction,
      returning: true,
    });
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
      createdBy: newPurchase.createdBy || '',
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
    if (!foundPurchase) throw notFound('Покупка не знайдена');
    const isPurchaseOwner =
      currentUser.id.toString() === foundPurchase.createdBy;
    if (!isPurchaseOwner)
      throw forbidden('Ви не маєте дозволу на редагування цієї покупки');
    const foundProduct = await getRecordByTitle(Product, product);
    if (!foundProduct) throw notFound('Товар не знайдено');
    const foundShop = await getRecordByTitle(Shop, shop);
    if (!foundShop) throw notFound('Магазин не знайдено');
    const foundMeasure = await getRecordByTitle(Measure, measure);
    if (!foundMeasure) throw notFound('Одиниця вимірювання не знайдена');
    const foundCurrency = await getRecordByTitle(Currency, currency);
    if (!foundCurrency) throw notFound('Валюта не знайдена');
    let amount = foundPurchase.amount;
    if (amountValue) {
      amount = parseFloat(amountValue) || 0;
    }
    let price = foundPurchase.price;
    if (priceValue) {
      price = parseFloat(priceValue) || 0;
    }
    const summ = parseFloat(amount) * parseFloat(price) || 0;
    const updateData = {
      productId: foundProduct.id,
      amount,
      price,
      summ,
      shopId: foundShop.id,
      measureId: foundMeasure.id,
      currencyId: foundCurrency.id,
    };
    const [affectedRows, [updatedPurchase]] = await Purchase.update(
      updateData,
      {
        where: { id },
        returning: true,
        transaction,
      }
    );
    if (affectedRows === 0) throw badRequest('Дані цієї покупки не оновлено');
    return {
      id: updatedPurchase.id,
      product: foundProduct.title,
      amount: updatedPurchase.amount,
      price: updatedPurchase.price,
      summ: updatedPurchase.summ,
      shop: foundShop.title,
      measure: foundMeasure.title,
      currency: foundCurrency.title,
      createdBy: updatedPurchase.createdBy || '',
    };
  }

  async deletePurchase(purchaseId, currentUser, transaction) {
    const foundPurchase = await Purchase.findByPk(purchaseId);
    if (!foundPurchase) throw notFound('Покупка не знайдена');
    const isPurchaseOwner =
      currentUser.id.toString() === foundPurchase.createdBy;
    if (!isPurchaseOwner)
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
