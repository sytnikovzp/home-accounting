const {
  Item,
  Product,
  Shop,
  Measure,
  Currency,
} = require('../db/dbPostgres/models');
const { notFound, badRequest } = require('../errors/customErrors');
const { formatDate, getRecordByTitle } = require('../utils/sharedFunctions');

class ItemService {
  async getAllItems(limit, offset) {
    const allItems = await Item.findAll({
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
    if (allItems.length === 0) throw notFound('Items not found');
    const formattedItems = allItems.map((item) => ({
      id: item.id,
      product: item['Product.title'] || '',
      amount: item.amount,
      price: item.price,
      summ: item.summ,
      shop: item['Shop.title'] || '',
      measure: item['Measure.title'] || '',
      currency: item['Currency.title'] || '',
    }));
    return formattedItems;
  }

  async getItemById(itemId) {
    const itemById = await Item.findByPk(itemId, {
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
    if (!itemById) throw notFound('Item not found');
    const itemData = itemById.toJSON();
    return {
      id: itemData.id,
      product: itemData.Product.title,
      amount: itemData.amount,
      price: itemData.price,
      summ: itemData.summ,
      shop: itemData.Shop.title,
      measure: itemData.Measure.title,
      currency: itemData.Currency.title,
      createdAt: formatDate(itemData.createdAt),
      updatedAt: formatDate(itemData.updatedAt),
    };
  }

  async createItem(
    product,
    amountValue,
    priceValue,
    shop,
    measure,
    currency,
    transaction
  ) {
    if (!product) throw notFound('Product not found');
    const productRecord = await getRecordByTitle(Product, product);
    if (!shop) throw notFound('Shop not found');
    const shopRecord = await getRecordByTitle(Shop, shop);
    if (!measure) throw notFound('Measure not found');
    const measureRecord = await getRecordByTitle(Measure, measure);
    if (!currency) throw notFound('Currency not found');
    const currencyRecord = await getRecordByTitle(Currency, currency);
    const amount = parseFloat(amountValue) || 0;
    const price = parseFloat(priceValue) || 0;
    const summ = parseFloat(amountValue) * parseFloat(priceValue) || 0;
    const newItemData = {
      productId: productRecord.id,
      amount,
      price,
      summ,
      shopId: shopRecord.id,
      measureId: measureRecord.id,
      currencyId: currencyRecord.id,
    };
    const newItem = await Item.create(newItemData, {
      transaction,
      returning: true,
    });
    if (!newItem) throw badRequest('Item is not created');
    return {
      id: newItem.id,
      product: productRecord.title,
      amount: newItem.amount,
      price: newItem.price,
      summ: newItem.summ,
      shop: shopRecord.title,
      measure: measureRecord.title,
      currency: currencyRecord.title,
    };
  }

  async updateItem(
    id,
    product,
    amountValue,
    priceValue,
    shop,
    measure,
    currency,
    transaction
  ) {
    const itemById = await Item.findByPk(id);
    if (!itemById) throw notFound('Item not found');
    if (!product) throw notFound('Product not found');
    const productRecord = await getRecordByTitle(Product, product);
    if (!shop) throw notFound('Shop not found');
    const shopRecord = await getRecordByTitle(Shop, shop);
    if (!measure) throw notFound('Measure not found');
    const measureRecord = await getRecordByTitle(Measure, measure);
    if (!currency) throw notFound('Currency not found');
    const currencyRecord = await getRecordByTitle(Currency, currency);
    let amount = itemById.amount;
    if (amountValue) {
      amount = parseFloat(amountValue) || 0;
    }
    let price = itemById.price;
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
    const [affectedRows, [updatedItem]] = await Item.update(updateData, {
      where: { id },
      returning: true,
      transaction,
    });
    if (affectedRows === 0) throw badRequest('Item is not updated');
    return {
      id: updatedItem.id,
      product: productRecord.title,
      amount: updatedItem.amount,
      price: updatedItem.price,
      summ: updatedItem.summ,
      shop: shopRecord.title,
      measure: measureRecord.title,
      currency: currencyRecord.title,
    };
  }

  async deleteItem(itemId, transaction) {
    const itemById = await Item.findByPk(itemId);
    if (!itemById) throw notFound('Item not found');
    const deletedItem = await Item.destroy({
      where: { id: itemId },
      transaction,
    });
    if (!deletedItem) throw badRequest('Item is not deleted');
    return deletedItem;
  }
}

module.exports = new ItemService();
