const { Op } = require('sequelize');
// ==============================================================
const {
  Item,
  Product,
  Shop,
  Category,
  sequelize,
} = require('../db/dbPostgres/models');
const { notFound } = require('../errors/customErrors');
const { getTime, getRecordByTitle } = require('../utils/sharedFunctions');

class StatisticService {
  async getCostByCategoryPerPeriod(category, ago) {
    const time = getTime(ago);
    const categoryRecord = await getRecordByTitle(Category, category);
    if (!categoryRecord) throw notFound('Category not found');
    const productIds = await Product.findAll({
      where: { categoryId: categoryRecord.id },
      attributes: ['id'],
      raw: true,
    });
    const prodIds = productIds.map((item) => item.id);
    if (prodIds.length === 0) {
      return [{ result: 0 }];
    }
    const costByCategoryPerPeriod = await Item.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('summ')), 'result']],
      where: {
        productId: { [Op.in]: prodIds },
        createdAt: { [Op.gte]: time },
      },
      group: ['currency_id'],
      raw: true,
    });
    const totalCost =
      costByCategoryPerPeriod.length > 0
        ? costByCategoryPerPeriod
        : [{ result: 0 }];
    return totalCost;
  }

  async getCostByShopPerPeriod(shop, ago) {
    const time = getTime(ago);
    const shopRecord = await getRecordByTitle(Shop, shop);
    if (!shopRecord) throw notFound('Shop not found');
    const costByShopPerPeriod = await Item.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('summ')), 'result']],
      where: {
        shopId: shopRecord.id,
        createdAt: { [Op.gte]: time },
      },
      group: ['currency_id'],
      raw: true,
    });
    const totalCost =
      costByShopPerPeriod.length > 0 ? costByShopPerPeriod : [{ result: 0 }];
    return totalCost;
  }

  async getCostByCategories(ago) {
    const time = getTime(ago);
    const result = await Item.findAll({
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
      where: { createdAt: { [Op.gte]: time } },
      group: ['Product->Category.id'],
      raw: true,
    });
    const totalCost = result.length
      ? result
      : [{ title: 'No data', result: '0' }];
    return totalCost;
  }

  async getCostByShops(ago) {
    const time = getTime(ago);
    const result = await Item.findAll({
      attributes: [
        'Shop.title',
        'Shop.url',
        [sequelize.fn('SUM', sequelize.col('summ')), 'result'],
      ],
      include: [{ model: Shop, attributes: [] }],
      where: { createdAt: { [Op.gte]: time } },
      group: ['Shop.title', 'Shop.url'],
      raw: true,
    });
    const totalCost = result.length
      ? result
      : [{ title: 'No data', result: '0' }];
    return totalCost;
  }
}

module.exports = new StatisticService();