const createError = require('http-errors');
const { format } = require('date-fns');
// =====================================
const {
  Item,
  Product,
  Shop,
  Measure,
  Currency,
  sequelize,
} = require('../db/dbPostgres/models');

class itemController {
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
        next(createError(404, 'Items not found'));
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
          createdAt: format(
            new Date(itemData.createdAt),
            'dd MMMM yyyy, HH:mm'
          ),
          updatedAt: format(
            new Date(itemData.updatedAt),
            'dd MMMM yyyy, HH:mm'
          ),
        };

        delete formattedItem.Product;
        delete formattedItem.Shop;
        delete formattedItem.Measure;
        delete formattedItem.Currency;

        res.status(200).json(formattedItem);
      } else {
        next(createError(404, 'Item not found'));
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
      const shop = shopValue === '' ? null : shopValue;
      const measure = measureValue === '' ? null : measureValue;
      const currency = currencyValue === '' ? null : currencyValue;

      const productRecord = product
        ? await Product.findOne({
            where: { title: product },
            attributes: ['id'],
            raw: true,
          })
        : null;

      if (product && !productRecord) {
        throw new Error('Product not found');
      }

      const productId = productRecord ? productRecord.id : null;

      const shopRecord = shop
        ? await Shop.findOne({
            where: { title: shop },
            attributes: ['id'],
            raw: true,
          })
        : null;

      if (shop && !shopRecord) {
        throw new Error('Shop not found');
      }

      const shopId = shopRecord ? shopRecord.id : null;

      const measureRecord = measure
        ? await Measure.findOne({
            where: { title: measure },
            attributes: ['id'],
            raw: true,
          })
        : null;

      if (measure && !measureRecord) {
        throw new Error('Measure not found');
      }

      const measureId = measureRecord ? measureRecord.id : null;

      const currencyRecord = currency
        ? await Currency.findOne({
            where: { title: currency },
            attributes: ['id'],
            raw: true,
          })
        : null;

      if (currency && !currencyRecord) {
        throw new Error('Currency not found');
      }

      const currencyId = currencyRecord ? currencyRecord.id : null;

      const summ =
        amount != null && price != null
          ? parseFloat(amount) * parseFloat(price)
          : 0;

      const newBody = {
        productId,
        amount,
        price,
        summ,
        shopId,
        measureId,
        currencyId,
      };

      const newItem = await Item.create(newBody, {
        transaction: t,
        returning: true,
      });

      if (newItem) {
        const itemData = newItem.toJSON();

        const formattedNewItem = {
          ...itemData,
          shopId: itemData.shopId || '',
          measureId: itemData.measureId || '',
          currencyId: itemData.currencyId || '',
          createdAt: format(
            new Date(itemData.createdAt),
            'dd MMMM yyyy, HH:mm'
          ),
          updatedAt: format(
            new Date(itemData.updatedAt),
            'dd MMMM yyyy, HH:mm'
          ),
        };

        await t.commit();
        res.status(201).json(formattedNewItem);
      } else {
        await t.rollback();
        next(createError(400, 'Bad request'));
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
      const shop = shopValue === '' ? null : shopValue;
      const measure = measureValue === '' ? null : measureValue;
      const currency = currencyValue === '' ? null : currencyValue;

      const productRecord = product
        ? await Product.findOne({
            where: { title: product },
            attributes: ['id'],
            raw: true,
          })
        : null;

      if (product && !productRecord) {
        throw new Error('Product not found');
      }

      const productId = productRecord ? productRecord.id : null;

      const shopRecord = shop
        ? await Shop.findOne({
            where: { title: shop },
            attributes: ['id'],
            raw: true,
          })
        : null;

      if (shop && !shopRecord) {
        throw new Error('Shop not found');
      }

      const shopId = shopRecord ? shopRecord.id : null;

      const measureRecord = measure
        ? await Measure.findOne({
            where: { title: measure },
            attributes: ['id'],
            raw: true,
          })
        : null;

      if (measure && !measureRecord) {
        throw new Error('Measure not found');
      }

      const measureId = measureRecord ? measureRecord.id : null;

      const currencyRecord = currency
        ? await Currency.findOne({
            where: { title: currency },
            attributes: ['id'],
            raw: true,
          })
        : null;

      if (currency && !currencyRecord) {
        throw new Error('Currency not found');
      }

      const currencyId = currencyRecord ? currencyRecord.id : null;

      const summ =
        amount != null && price != null
          ? parseFloat(amount) * parseFloat(price)
          : 0;

      const newBody = {
        productId,
        amount,
        price,
        summ,
        shopId,
        measureId,
        currencyId,
      };

      const [affectedRows, [updatedItem]] = await Item.update(newBody, {
        where: { id },
        returning: true,
        transaction: t,
      });

      if (affectedRows > 0) {
        const itemData = updatedItem.toJSON();

        const formattedUpdItem = {
          ...itemData,
          productId: itemData.product_id || '',
          shopId: itemData.shop_id || '',
          measureId: itemData.measure_id || '',
          currencyId: itemData.currency_id || '',
          createdAt: format(
            new Date(itemData.createdAt),
            'dd MMMM yyyy, HH:mm'
          ),
          updatedAt: format(
            new Date(itemData.updatedAt),
            'dd MMMM yyyy, HH:mm'
          ),
        };

        delete formattedUpdItem.product_id;
        delete formattedUpdItem.shop_id;
        delete formattedUpdItem.measure_id;
        delete formattedUpdItem.currency_id;

        await t.commit();
        res.status(201).json(formattedUpdItem);
      } else {
        await t.rollback();
        next(createError(400, 'Bad request'));
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
        next(createError(400, 'Bad request'));
      }
    } catch (error) {
      console.log(error.message);
      await t.rollback();
      next(error);
    }
  }
}

module.exports = new itemController();
