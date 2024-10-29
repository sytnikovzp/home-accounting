const { notFound, badRequest } = require('../errors/customErrors');
const {
  Item,
  Product,
  Shop,
  Measure,
  Currency,
  sequelize,
} = require('../db/dbPostgres/models');
const { formatDate } = require('../utils/sharedFunctions');

class ItemController {
  async getAllItems(req, res, next) {
    try {
      const { limit, offset } = req.pagination;
      const allItems = await Item.findAll({
        attributes: ['id', 'amount', 'price', 'summ'],
        include: [
          {
            model: Product,
            attributes: ['title'],
          },
          {
            model: Shop,
            attributes: ['title'],
          },
          {
            model: Measure,
            attributes: ['title'],
          },
          {
            model: Currency,
            attributes: ['title'],
          },
        ],
        raw: true,
        limit,
        offset,
      });
      const itemsCount = await Item.count();
      const formattedItems = allItems.map((item) => {
        return {
          id: item.id,
          product: item['Product.title'] || '',
          amount: item.amount,
          price: item.price,
          summ: item.summ,
          shop: item['Shop.title'] || '',
          measure: item['Measure.title'] || '',
          currency: item['Currency.title'] || '',
        };
      });
      if (allItems.length > 0) {
        res.status(200).set('X-Total-Count', itemsCount).json(formattedItems);
      } else {
        throw notFound('Items not found');
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async getItemById(req, res, next) {
    try {
      const { itemId } = req.params;
      const itemById = await Item.findByPk(itemId, {
        attributes: {
          exclude: [
            'productId',
            'product_id',
            'shopId',
            'shop_id',
            'measureId',
            'measure_id',
            'currencyId',
            'currency_id',
          ],
        },
        include: [
          {
            model: Product,
            attributes: ['title'],
          },
          {
            model: Shop,
            attributes: ['title'],
          },
          {
            model: Measure,
            attributes: ['title'],
          },
          {
            model: Currency,
            attributes: ['title'],
          },
        ],
      });
      if (itemById) {
        const itemData = itemById.toJSON();
        const formattedItem = {
          ...itemData,
          product: itemData.Product.title,
          amount: itemData.amount || '',
          price: itemData.price || '',
          summ: itemData.summ || '',
          shop: itemData.Shop?.title || '',
          measure: itemData.Measure?.title || '',
          currency: itemData.Currency?.title || '',
          createdAt: formatDate(itemData.createdAt),
          updatedAt: formatDate(itemData.updatedAt),
        };
        delete formattedItem.Product;
        delete formattedItem.Shop;
        delete formattedItem.Measure;
        delete formattedItem.Currency;
        res.status(200).json(formattedItem);
      } else {
        throw notFound('Item not found');
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async createItem(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const {
        product,
        amount: amountValue,
        price: priceValue,
        shop: shopValue,
        measure: measureValue,
        currency: currencyValue,
      } = req.body;
      const amount = amountValue === '' ? 0 : amountValue;
      const price = priceValue === '' ? 0 : priceValue;
      async function getRecordByTitle(Model, title) {
        if (!title) return null;
        const record = await Model.findOne({
          where: { title },
          attributes: ['id', 'title'],
          raw: true,
        });
        if (!record) throw notFound(`${Model.name} not found`);
        return record;
      }
      const productRecord = await getRecordByTitle(Product, product);
      const shopRecord = await getRecordByTitle(Shop, shopValue);
      const measureRecord = await getRecordByTitle(Measure, measureValue);
      const currencyRecord = await getRecordByTitle(Currency, currencyValue);
      const summ = parseFloat(amount) * parseFloat(price) || 0;
      const newBody = {
        productId: productRecord ? productRecord.id : null,
        amount,
        price,
        summ,
        shopId: shopRecord ? shopRecord.id : null,
        measureId: measureRecord ? measureRecord.id : null,
        currencyId: currencyRecord ? currencyRecord.id : null,
      };
      const newItem = await Item.create(newBody, {
        transaction: t,
        returning: true,
      });
      if (newItem) {
        const itemData = newItem.toJSON();
        const formattedNewItem = {
          id: itemData.id,
          productId: itemData.productId,
          amount: itemData.amount,
          price: itemData.price,
          summ: itemData.summ,
          shop: shopRecord ? shopRecord.title : '',
          measure: measureRecord ? measureRecord.title : '',
          currency: currencyRecord ? currencyRecord.title : '',
        };
        await t.commit();
        res.status(201).json(formattedNewItem);
      } else {
        await t.rollback();
        throw badRequest('Item is not created');
      }
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      next(error);
    }
  }

  async updateItem(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const {
        id,
        product,
        amount: amountValue,
        price: priceValue,
        shop: shopValue,
        measure: measureValue,
        currency: currencyValue,
      } = req.body;
      const amount = amountValue === '' ? 0 : amountValue;
      const price = priceValue === '' ? 0 : priceValue;
      async function getRecordByTitle(Model, title) {
        if (!title) return null;
        const record = await Model.findOne({
          where: { title },
          attributes: ['id', 'title'],
          raw: true,
        });
        if (!record) throw notFound(`${Model.name} not found`);
        return record;
      }
      const productRecord = product
        ? await getRecordByTitle(Product, product)
        : null;
      const shopRecord = await getRecordByTitle(Shop, shopValue);
      const measureRecord = await getRecordByTitle(Measure, measureValue);
      const currencyRecord = await getRecordByTitle(Currency, currencyValue);
      const summ = parseFloat(amount) * parseFloat(price) || 0;
      const newBody = {
        productId: productRecord ? productRecord.id : null,
        amount,
        price,
        summ,
        shopId: shopRecord ? shopRecord.id : null,
        measureId: measureRecord ? measureRecord.id : null,
        currencyId: currencyRecord ? currencyRecord.id : null,
      };
      const [affectedRows, [updatedItem]] = await Item.update(newBody, {
        where: { id },
        returning: true,
        transaction: t,
      });
      if (affectedRows > 0) {
        const itemData = updatedItem.toJSON();
        const formattedUpdItem = {
          id: itemData.id,
          productId: itemData.productId,
          amount: itemData.amount,
          price: itemData.price,
          summ: itemData.summ,
          shop: shopRecord ? shopRecord.title : '',
          measure: measureRecord ? measureRecord.title : '',
          currency: currencyRecord ? currencyRecord.title : '',
        };
        await t.commit();
        res.status(200).json(formattedUpdItem);
      } else {
        await t.rollback();
        throw badRequest('Item is not updated');
      }
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      next(error);
    }
  }

  async deleteItem(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { itemId } = req.params;
      const deleteItem = await Item.destroy({
        where: {
          id: itemId,
        },
        transaction: t,
      });
      if (deleteItem) {
        await t.commit();
        res.sendStatus(res.statusCode);
      } else {
        await t.rollback();
        throw badRequest('Item is not deleted');
      }
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      next(error);
    }
  }
}

module.exports = new ItemController();
