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
      group: ['Product->Category.uuid'],
      include: [
        {
          attributes: [],
          include: [
            {
              attributes: [],
              model: Category,
            },
          ],
          model: Product,
        },
      ],
      raw: true,
      where: whereCondition,
    });
    return result.length ? result : [{ result: '0', title: 'Немає даних' }];
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
      group: ['Establishment.title'],
      include: [{ attributes: [], model: Establishment }],
      raw: true,
      where: whereCondition,
    });
    return result.length ? result : [{ result: '0', title: 'Немає даних' }];
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
      group: ['Product.title'],
      include: [{ attributes: [], model: Product }],
      raw: true,
      where: whereCondition,
    });
    return result.length ? result : [{ result: '0', title: 'Немає даних' }];
  }
}

module.exports = StatisticsService;
