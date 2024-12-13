const { Op } = require('sequelize');
// ==============================================================
const {
  Purchase,
  Product,
  Shop,
  Category,
  sequelize,
} = require('../db/dbPostgres/models');
const { getTime, getRecordByTitle } = require('../utils/sharedFunctions');
const { notFound } = require('../errors/generalErrors');

class StatisticService {
  async getCostByCategoryPerPeriod(category, ago) {
    const time = getTime(ago);
    const foundCategory = await getRecordByTitle(Category, category);
    if (!foundCategory) throw notFound('Категорію не знайдено');
    const productUuids = await Product.findAll({
      where: { categoryUuid: foundCategory.uuid },
      attributes: ['uuid'],
      raw: true,
    });
    const prodUuids = productUuids.map((purchase) => purchase.uuid);
    if (prodUuids.length === 0) {
      return [{ result: 0 }];
    }
    const costByCategoryPerPeriod = await Purchase.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('summ')), 'result']],
      where: {
        productUuid: { [Op.in]: prodUuids },
        createdAt: { [Op.gte]: time },
      },
      group: ['currency_uuid'],
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
    const foundShop = await getRecordByTitle(Shop, shop);
    if (!foundShop) throw notFound('Магазин не знайдено');
    const costByShopPerPeriod = await Purchase.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('summ')), 'result']],
      where: {
        shopUuid: foundShop.uuid,
        createdAt: { [Op.gte]: time },
      },
      group: ['currency_uuid'],
      raw: true,
    });
    const totalCost =
      costByShopPerPeriod.length > 0 ? costByShopPerPeriod : [{ result: 0 }];
    return totalCost;
  }

  async getCostByCategories(ago) {
    const time = getTime(ago);
    const result = await Purchase.findAll({
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
      group: ['Product->Category.uuid'],
      raw: true,
    });
    const totalCost = result.length
      ? result
      : [{ title: 'No data', result: '0' }];
    return totalCost;
  }

  async getCostByShops(ago) {
    const time = getTime(ago);
    const result = await Purchase.findAll({
      attributes: [
        'Shop.title',
        [sequelize.fn('COALESCE', sequelize.col('Shop.url'), ''), 'url'],
        [sequelize.fn('COALESCE', sequelize.col('Shop.logo'), ''), 'logo'],
        [sequelize.fn('SUM', sequelize.col('summ')), 'result'],
      ],
      include: [{ model: Shop, attributes: [] }],
      where: { createdAt: { [Op.gte]: time } },
      group: ['Shop.title', 'Shop.url', 'Shop.logo'],
      raw: true,
    });
    const totalCost = result.length
      ? result
      : [{ title: 'No data', result: '0' }];
    return totalCost;
  }
}

module.exports = new StatisticService();
