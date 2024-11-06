const {
  Purchase,
  Product,
  Shop,
  Measure,
  Currency,
} = require('../db/dbPostgres/models');
const { notFound, badRequest } = require('../errors/customErrors');
const { formatDate, getRecordByTitle } = require('../utils/sharedFunctions');

class PurchaseService {
  async getAllPurchases(limit, offset) {
    const findPurchases = await Purchase.findAll({
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
    if (findPurchases.length === 0) throw notFound('Purchases not found');
    const allPurchases = findPurchases.map((purchase) => ({
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
    const findPurchase = await Purchase.findByPk(purchaseId, {
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
    if (!findPurchase) throw notFound('Purchase not found');
    const purchaseData = findPurchase.toJSON();
    return {
      id: purchaseData.id,
      product: purchaseData.Product.title,
      amount: purchaseData.amount,
      price: purchaseData.price,
      summ: purchaseData.summ,
      shop: purchaseData.Shop.title,
      measure: purchaseData.Measure.title,
      currency: purchaseData.Currency.title,
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
    transaction
  ) {
    const findProduct = await getRecordByTitle(Product, product);
    if (!findProduct) throw notFound('Product not found');
    const findShop = await getRecordByTitle(Shop, shop);
    if (!findShop) throw notFound('Shop not found');
    const findMeasure = await getRecordByTitle(Measure, measure);
    if (!findMeasure) throw notFound('Measure not found');
    const findCurrency = await getRecordByTitle(Currency, currency);
    if (!findCurrency) throw notFound('Currency not found');
    const amount = parseFloat(amountValue) || 0;
    const price = parseFloat(priceValue) || 0;
    const summ = parseFloat(amountValue) * parseFloat(priceValue) || 0;
    const newPurchaseData = {
      productId: findProduct.id,
      amount,
      price,
      summ,
      shopId: findShop.id,
      measureId: findMeasure.id,
      currencyId: findCurrency.id,
    };
    const newPurchase = await Purchase.create(newPurchaseData, {
      transaction,
      returning: true,
    });
    if (!newPurchase) throw badRequest('Purchase is not created');
    return {
      id: newPurchase.id,
      product: findProduct.title,
      amount: newPurchase.amount,
      price: newPurchase.price,
      summ: newPurchase.summ,
      shop: findShop.title,
      measure: findMeasure.title,
      currency: findCurrency.title,
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
    transaction
  ) {
    const findPurchase = await Purchase.findByPk(id);
    if (!findPurchase) throw notFound('Purchase not found');
    const findProduct = await getRecordByTitle(Product, product);
    if (!findProduct) throw notFound('Product not found');
    const findShop = await getRecordByTitle(Shop, shop);
    if (!findShop) throw notFound('Shop not found');
    const findMeasure = await getRecordByTitle(Measure, measure);
    if (!findMeasure) throw notFound('Measure not found');
    const findCurrency = await getRecordByTitle(Currency, currency);
    if (!findCurrency) throw notFound('Currency not found');
    let amount = findPurchase.amount;
    if (amountValue) {
      amount = parseFloat(amountValue) || 0;
    }
    let price = findPurchase.price;
    if (priceValue) {
      price = parseFloat(priceValue) || 0;
    }
    const summ = parseFloat(amount) * parseFloat(price) || 0;
    const updateData = {
      productId: findProduct.id,
      amount,
      price,
      summ,
      shopId: findShop.id,
      measureId: findMeasure.id,
      currencyId: findCurrency.id,
    };
    const [affectedRows, [updatedPurchase]] = await Purchase.update(
      updateData,
      {
        where: { id },
        returning: true,
        transaction,
      }
    );
    if (affectedRows === 0) throw badRequest('Purchase is not updated');
    return {
      id: updatedPurchase.id,
      product: findProduct.title,
      amount: updatedPurchase.amount,
      price: updatedPurchase.price,
      summ: updatedPurchase.summ,
      shop: findShop.title,
      measure: findMeasure.title,
      currency: findCurrency.title,
    };
  }

  async deletePurchase(purchaseId, transaction) {
    const findPurchase = await Purchase.findByPk(purchaseId);
    if (!findPurchase) throw notFound('Purchase not found');
    const deletedPurchase = await Purchase.destroy({
      where: { id: purchaseId },
      transaction,
    });
    if (!deletedPurchase) throw badRequest('Purchase is not deleted');
    return deletedPurchase;
  }
}

module.exports = new PurchaseService();
