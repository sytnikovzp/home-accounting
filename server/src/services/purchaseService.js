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
    const allPurchases = await Purchase.findAll({
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
    if (allPurchases.length === 0) throw notFound('Purchases not found');
    const formattedPurchases = allPurchases.map((purchase) => ({
      id: purchase.id,
      product: purchase['Product.title'] || '',
      amount: purchase.amount,
      price: purchase.price,
      summ: purchase.summ,
      shop: purchase['Shop.title'] || '',
      measure: purchase['Measure.title'] || '',
      currency: purchase['Currency.title'] || '',
    }));
    return formattedPurchases;
  }

  async getPurchaseById(purchaseId) {
    const purchaseById = await Purchase.findByPk(purchaseId, {
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
    if (!purchaseById) throw notFound('Purchase not found');
    const purchaseData = purchaseById.toJSON();
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
    const productRecord = await getRecordByTitle(Product, product);
    if (!productRecord) throw notFound('Product not found');
    const shopRecord = await getRecordByTitle(Shop, shop);
    if (!shopRecord) throw notFound('Shop not found');
    const measureRecord = await getRecordByTitle(Measure, measure);
    if (!measureRecord) throw notFound('Measure not found');
    const currencyRecord = await getRecordByTitle(Currency, currency);
    if (!currencyRecord) throw notFound('Currency not found');
    const amount = parseFloat(amountValue) || 0;
    const price = parseFloat(priceValue) || 0;
    const summ = parseFloat(amountValue) * parseFloat(priceValue) || 0;
    const newPurchaseData = {
      productId: productRecord.id,
      amount,
      price,
      summ,
      shopId: shopRecord.id,
      measureId: measureRecord.id,
      currencyId: currencyRecord.id,
    };
    const newPurchase = await Purchase.create(newPurchaseData, {
      transaction,
      returning: true,
    });
    if (!newPurchase) throw badRequest('Purchase is not created');
    return {
      id: newPurchase.id,
      product: productRecord.title,
      amount: newPurchase.amount,
      price: newPurchase.price,
      summ: newPurchase.summ,
      shop: shopRecord.title,
      measure: measureRecord.title,
      currency: currencyRecord.title,
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
    const purchaseById = await Purchase.findByPk(id);
    if (!purchaseById) throw notFound('Purchase not found');
    const productRecord = await getRecordByTitle(Product, product);
    if (!productRecord) throw notFound('Product not found');
    const shopRecord = await getRecordByTitle(Shop, shop);
    if (!shopRecord) throw notFound('Shop not found');
    const measureRecord = await getRecordByTitle(Measure, measure);
    if (!measureRecord) throw notFound('Measure not found');
    const currencyRecord = await getRecordByTitle(Currency, currency);
    if (!currencyRecord) throw notFound('Currency not found');
    let amount = purchaseById.amount;
    if (amountValue) {
      amount = parseFloat(amountValue) || 0;
    }
    let price = purchaseById.price;
    if (priceValue) {
      price = parseFloat(priceValue) || 0;
    }
    const summ = parseFloat(amount) * parseFloat(price) || 0;
    const updateData = {
      productId: productRecord.id,
      amount,
      price,
      summ,
      shopId: shopRecord.id,
      measureId: measureRecord.id,
      currencyId: currencyRecord.id,
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
      product: productRecord.title,
      amount: updatedPurchase.amount,
      price: updatedPurchase.price,
      summ: updatedPurchase.summ,
      shop: shopRecord.title,
      measure: measureRecord.title,
      currency: currencyRecord.title,
    };
  }

  async deletePurchase(purchaseId, transaction) {
    const purchaseById = await Purchase.findByPk(purchaseId);
    if (!purchaseById) throw notFound('Purchase not found');
    const deletedPurchase = await Purchase.destroy({
      where: { id: purchaseId },
      transaction,
    });
    if (!deletedPurchase) throw badRequest('Purchase is not deleted');
    return deletedPurchase;
  }
}

module.exports = new PurchaseService();
