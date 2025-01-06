const { Op } = require('sequelize');
// ==============================================================
const {
  Expense,
  Product,
  Establishment,
  Category,
  sequelize,
} = require('../db/dbPostgres/models');
const { getTime } = require('../utils/sharedFunctions');

class StatisticService {
  async getCostByCategories(ago) {
    const time = getTime(ago);
    const result = await Expense.findAll({
      attributes: [
        'Product->Category.title',
        [
          sequelize.literal('ROUND(SUM("quantity" * "unit_price"), 2)'),
          'result',
        ],
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
      where: { date: { [Op.gte]: time } },
      group: ['Product->Category.uuid'],
      raw: true,
    });
    const totalCost = result.length
      ? result
      : [{ title: 'Немає даних', result: '0' }];
    return totalCost;
  }

  async getCostByEstablishments(ago) {
    const time = getTime(ago);
    const result = await Expense.findAll({
      attributes: [
        'Establishment.title',
        [
          sequelize.literal('ROUND(SUM("quantity" * "unit_price"), 2)'),
          'result',
        ],
      ],
      include: [{ model: Establishment, attributes: [] }],
      where: { date: { [Op.gte]: time } },
      group: ['Establishment.title'],
      raw: true,
    });
    const totalCost = result.length
      ? result
      : [{ title: 'Немає даних', result: '0' }];
    return totalCost;
  }

  async getCostByProducts(ago) {
    const time = getTime(ago);
    const result = await Expense.findAll({
      attributes: [
        'Product.title',
        [
          sequelize.literal('ROUND(SUM("quantity" * "unit_price"), 2)'),
          'result',
        ],
      ],
      include: [{ model: Product, attributes: [] }],
      where: { date: { [Op.gte]: time } },
      group: ['Product.title'],
      raw: true,
    });
    const totalCost = result.length
      ? result
      : [{ title: 'Немає даних', result: '0' }];
    return totalCost;
  }
}

module.exports = new StatisticService();
