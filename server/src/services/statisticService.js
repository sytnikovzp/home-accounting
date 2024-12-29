const { Op } = require('sequelize');
// ==============================================================
const {
  Purchase,
  Product,
  Establishment,
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

  async getCostByEstablishmentPerPeriod(establishment, ago) {
    const time = getTime(ago);
    const foundEstablishment = await getRecordByTitle(
      Establishment,
      establishment
    );
    if (!foundEstablishment) throw notFound('Заклад не знайдено');
    const costByEstablishmentPerPeriod = await Purchase.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('summ')), 'result']],
      where: {
        establishmentUuid: foundEstablishment.uuid,
        createdAt: { [Op.gte]: time },
      },
      group: ['currency_uuid'],
      raw: true,
    });
    const totalCost =
      costByEstablishmentPerPeriod.length > 0
        ? costByEstablishmentPerPeriod
        : [{ result: 0 }];
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

  async getCostByEstablishments(ago) {
    const time = getTime(ago);
    const result = await Purchase.findAll({
      attributes: [
        'Establishment.title',
        [
          sequelize.fn('COALESCE', sequelize.col('Establishment.url'), ''),
          'url',
        ],
        [
          sequelize.fn('COALESCE', sequelize.col('Establishment.logo'), ''),
          'logo',
        ],
        [sequelize.fn('SUM', sequelize.col('summ')), 'result'],
      ],
      include: [{ model: Establishment, attributes: [] }],
      where: { createdAt: { [Op.gte]: time } },
      group: ['Establishment.title', 'Establishment.url', 'Establishment.logo'],
      raw: true,
    });
    const totalCost = result.length
      ? result
      : [{ title: 'No data', result: '0' }];
    return totalCost;
  }
}

module.exports = new StatisticService();
