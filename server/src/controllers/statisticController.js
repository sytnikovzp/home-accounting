const createError = require('http-errors');
const { Op } = require('sequelize');
// ====================================================
const {
  Category,
  Product,
  Shop,
  Item,
  sequelize,
} = require('../db/dbPostgres/models');

const getTime = (ago = 'allTime') => {
  const intervals = {
    day: () => timeAgo.setDate(timeAgo.getDate() - 1),
    week: () => timeAgo.setDate(timeAgo.getDate() - 7),
    month: () => timeAgo.setMonth(timeAgo.getMonth() - 1),
    year: () => timeAgo.setFullYear(timeAgo.getFullYear() - 1),
    allTime: () => new Date(0),
  };

  const timeAgo = new Date();
  return (intervals[ago] || intervals.allTime)();
};

class StatisticController {
  async getCostByCategoryPerPeriod(req, res, next) {
    try {
      const { category, ago } = req.query;

      const time = getTime(ago);

      const categoryRecord = await Category.findOne({
        attributes: ['id'],
        where: {
          title: category,
        },
        raw: true,
      });

      if (!categoryRecord) {
        return next(createError(404, 'Category not found'));
      }

      const categoryId = categoryRecord.id;

      const productIds = await Product.findAll({
        where: {
          categoryId,
        },
        attributes: ['id'],
        raw: true,
      });

      const prodIds = productIds.map((item) => item.id);

      if (prodIds.length === 0) {
        return res.status(200).json([{ result: 0 }]);
      }

      const costByCategoryPerPeriod = await Item.findAll({
        attributes: [[sequelize.fn('SUM', sequelize.col('summ')), 'result']],
        where: {
          productId: {
            [Op.in]: prodIds,
          },
          createdAt: {
            [Op.gte]: time,
          },
        },
        group: ['currency_id'],
        raw: true,
      });

      if (costByCategoryPerPeriod.length === 0) {
        return res.status(200).json([{ result: 0 }]);
      }

      res.status(200).json(costByCategoryPerPeriod);
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async getCostByShopPerPeriod(req, res, next) {
    try {
      const { shop, ago } = req.query;

      const time = getTime(ago);

      const shopRecord = await Shop.findOne({
        attributes: ['id'],
        where: {
          title: shop,
        },
        raw: true,
      });

      if (!shopRecord) {
        return next(createError(404, 'Shop not found'));
      }

      const shopId = shopRecord.id;

      const costByShopPerPeriod = await Item.findAll({
        attributes: [[sequelize.fn('SUM', sequelize.col('summ')), 'result']],
        where: {
          shopId,
          createdAt: {
            [Op.gte]: time,
          },
        },
        group: ['currency_id'],
        raw: true,
      });

      if (costByShopPerPeriod.length === 0) {
        return res.status(200).json([{ result: 0 }]);
      }

      res.status(200).json(costByShopPerPeriod);
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  }

  async getCostByCategories(req, res, next) {
    try {
      const { ago } = req.query;

      const time = getTime(ago);

      const costByCategories = await Item.findAll({
        attributes: [
          'Product->Category.title',
          [sequelize.fn('SUM', sequelize.col('summ')), 'result'],
        ],
        include: [
          {
            model: Product,
            attributes: [],
            include: [
              {
                model: Category,
                attributes: [],
              },
            ],
          },
        ],
        where: {
          createdAt: {
            [Op.gte]: time,
          },
        },
        group: ['Product->Category.id'],
        raw: true,
      });

      if (costByCategories) {
        res.status(200).json(costByCategories);
      } else {
        next(createError(404, 'Bad request'));
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }

  async getCostByShops(req, res, next) {
    try {
      const { ago } = req.query;

      const time = getTime(ago);

      const costByShop = await Item.findAll({
        attributes: [
          'Shop.title',
          'Shop.url',
          [sequelize.fn('SUM', sequelize.col('summ')), 'result'],
        ],
        include: [
          {
            model: Shop,
            attributes: [],
          },
        ],
        where: {
          createdAt: {
            [Op.gte]: time,
          },
        },
        group: ['Shop.title', 'Shop.url'],
        raw: true,
      });

      if (costByShop) {
        res.status(200).json(costByShop);
      } else {
        next(createError(404, 'Bad request'));
      }
    } catch (error) {
      console.log(error.message);
      next(error);
    }
  }
}

module.exports = new StatisticController();
