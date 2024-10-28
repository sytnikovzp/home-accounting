/* eslint-disable camelcase */
const createError = require('http-errors');
const { Shop, Category, Product, Item } = require('../db/dbPostgres/models');

class StatisticController {
  async getMoneyByShop(req, res, next) {
    try {
      const { shopId } = req.params;

      const shop = await Shop.findByPk(shopId, {
        attributes: ['id', 'title'],
        raw: true,
      });

      if (!shop) {
        return next(createError(404, 'Shop not found'));
      }

      const totalSum = await Item.sum('summ', {
        where: { shop_id: shopId },
      });

      const result = {
        shop: shop.title,
        totalSum: totalSum || 0,
      };

      res.status(200).json(result);
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async getMoneyByCategory(req, res, next) {
    try {
      const { categoryId } = req.params;

      const category = await Category.findByPk(categoryId, {
        attributes: ['id', 'title'],
        raw: true,
      });

      if (!category) {
        return next(createError(404, 'Category not found'));
      }

      const totalSum = await Item.sum('summ', {
        include: [
          {
            model: Product,
            where: { category_id: categoryId },
            attributes: [],
          },
        ],
      });

      const result = {
        category: category.title,
        totalSum: totalSum || 0,
      };

      res.status(200).json(result);
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
}

module.exports = new StatisticController();
