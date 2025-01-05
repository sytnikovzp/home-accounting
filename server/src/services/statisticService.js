const { Op } = require('sequelize');
// ==============================================================
const {
  Expense,
  Product,
  Establishment,
  Category,
  sequelize,
} = require('../db/dbPostgres/models');
const { getTime, getRecordByTitle } = require('../utils/sharedFunctions');
const { notFound, badRequest } = require('../errors/generalErrors');

class StatisticService {
  async getCostByCategoryPerPeriod(category, ago) {
    if (!category) throw badRequest('Необхідний параметр: category');
    const time = getTime(ago);
    const foundCategory = await getRecordByTitle(Category, category);
    if (!foundCategory) throw notFound('Категорію не знайдено');
    const costByCategoryPerPeriod = await Expense.findAll({
      attributes: [
        [sequelize.col('Product->Category.title'), 'title'],
        [
          sequelize.literal('ROUND(SUM("quantity" * "unit_price"), 2)'),
          'result',
        ],
      ],
      where: {
        createdAt: { [Op.gte]: time },
      },
      include: [
        {
          model: Product,
          attributes: [],
          where: { categoryUuid: foundCategory.uuid },
          include: [
            {
              model: Category,
              attributes: [],
            },
          ],
        },
      ],
      group: ['Product->Category.title'],
      raw: true,
    });
    const totalCost =
      costByCategoryPerPeriod.length > 0
        ? costByCategoryPerPeriod
        : [{ title: category, result: 0 }];
    return totalCost;
  }

  async getCostByEstablishmentPerPeriod(establishment, ago) {
    if (!establishment) throw badRequest('Необхідний параметр: establishment');
    const time = getTime(ago);
    const foundEstablishment = await getRecordByTitle(
      Establishment,
      establishment
    );
    if (!foundEstablishment) throw notFound('Заклад не знайдено');
    const costByEstablishmentPerPeriod = await Expense.findAll({
      attributes: [
        [sequelize.col('Establishment.title'), 'title'],
        [
          sequelize.literal('ROUND(SUM("quantity" * "unit_price"), 2)'),
          'result',
        ],
      ],
      where: {
        establishmentUuid: foundEstablishment.uuid,
        createdAt: { [Op.gte]: time },
      },
      include: [
        {
          model: Establishment,
          attributes: [],
        },
      ],
      group: ['currency_uuid', 'Establishment.title'],
      raw: true,
    });
    const totalCost =
      costByEstablishmentPerPeriod.length > 0
        ? costByEstablishmentPerPeriod
        : [{ result: 0 }];
    return totalCost;
  }

  async getCostByProductPerPeriod(product, ago) {
    if (!product) throw badRequest('Необхідний параметр: product');
    const time = getTime(ago);
    const foundProduct = await getRecordByTitle(Product, product);
    if (!foundProduct) throw notFound('Товар не знайдено');
    const costByProductPerPeriod = await Expense.findAll({
      attributes: [
        [sequelize.col('Product.title'), 'title'],
        [
          sequelize.literal('ROUND(SUM("quantity" * "unit_price"), 2)'),
          'result',
        ],
      ],
      where: {
        productUuid: foundProduct.uuid,
        createdAt: { [Op.gte]: time },
      },
      include: [
        {
          model: Product,
          attributes: [],
        },
      ],
      group: ['currency_uuid', 'Product.title'],
      raw: true,
    });
    const totalCost =
      costByProductPerPeriod.length > 0
        ? costByProductPerPeriod
        : [{ result: 0 }];
    return totalCost;
  }

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
    const result = await Expense.findAll({
      attributes: [
        'Establishment.title',
        [
          sequelize.literal('ROUND(SUM("quantity" * "unit_price"), 2)'),
          'result',
        ],
      ],
      include: [{ model: Establishment, attributes: [] }],
      where: { createdAt: { [Op.gte]: time } },
      group: ['Establishment.title'],
      raw: true,
    });
    const totalCost = result.length
      ? result
      : [{ title: 'No data', result: '0' }];
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
      where: { createdAt: { [Op.gte]: time } },
      group: ['Product.title'],
      raw: true,
    });
    const totalCost = result.length
      ? result
      : [{ title: 'No data', result: '0' }];
    return totalCost;
  }
}

module.exports = new StatisticService();
