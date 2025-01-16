const { Op } = require('sequelize');

const {
  Expense,
  Product,
  Establishment,
  Category,
  sequelize,
} = require('../db/dbPostgres/models');

const { badRequest } = require('../errors/generalErrors');
const { getTime, isValidUUID } = require('../utils/sharedFunctions');

class StatisticsService {
  static async getCostByCategories(ago, creatorUuid) {
    if (creatorUuid && !isValidUUID(creatorUuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const time = getTime(ago);
    const whereCondition = {
      date: { [Op.gte]: time },
      ...(creatorUuid && { creatorUuid }),
    };
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
      where: whereCondition,
      group: ['Product->Category.uuid'],
      raw: true,
    });
    return result.length ? result : [{ title: 'Немає даних', result: '0' }];
  }

  static async getCostByEstablishments(ago, creatorUuid) {
    if (creatorUuid && !isValidUUID(creatorUuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const time = getTime(ago);
    const whereCondition = {
      date: { [Op.gte]: time },
      ...(creatorUuid && { creatorUuid }),
    };
    const result = await Expense.findAll({
      attributes: [
        'Establishment.title',
        [
          sequelize.literal('ROUND(SUM("quantity" * "unit_price"), 2)'),
          'result',
        ],
      ],
      include: [{ model: Establishment, attributes: [] }],
      where: whereCondition,
      group: ['Establishment.title'],
      raw: true,
    });
    return result.length ? result : [{ title: 'Немає даних', result: '0' }];
  }

  static async getCostByProducts(ago, creatorUuid) {
    if (creatorUuid && !isValidUUID(creatorUuid)) {
      throw badRequest('Невірний формат UUID');
    }
    const time = getTime(ago);
    const whereCondition = {
      date: { [Op.gte]: time },
      ...(creatorUuid && { creatorUuid }),
    };
    const result = await Expense.findAll({
      attributes: [
        'Product.title',
        [
          sequelize.literal('ROUND(SUM("quantity" * "unit_price"), 2)'),
          'result',
        ],
      ],
      include: [{ model: Product, attributes: [] }],
      where: whereCondition,
      group: ['Product.title'],
      raw: true,
    });
    return result.length ? result : [{ title: 'Немає даних', result: '0' }];
  }
}

module.exports = StatisticsService;
