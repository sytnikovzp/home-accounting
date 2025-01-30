/* eslint-disable camelcase */
const { Product, Establishment, Measure, Currency } = require('../models');

const { postgresData } = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    const { expenses } = await postgresData();
    const [products, establishments, measures, currencies] = await Promise.all([
      Product.findAll({ attributes: ['uuid', 'title'] }),
      Establishment.findAll({ attributes: ['uuid', 'title'] }),
      Measure.findAll({ attributes: ['uuid', 'title'] }),
      Currency.findAll({ attributes: ['uuid', 'title'] }),
    ]);
    const productMap = products.reduce((acc, product) => {
      acc[product.title] = product.uuid;
      return acc;
    }, {});
    const establishmentMap = establishments.reduce((acc, establishment) => {
      acc[establishment.title] = establishment.uuid;
      return acc;
    }, {});
    const measureMap = measures.reduce((acc, measure) => {
      acc[measure.title] = measure.uuid;
      return acc;
    }, {});
    const currencyMap = currencies.reduce((acc, currency) => {
      acc[currency.title] = currency.uuid;
      return acc;
    }, {});
    const updatedExpenses = expenses.map((expense) => {
      expense.product_uuid = productMap[expense.product] || null;
      expense.establishment_uuid =
        establishmentMap[expense.establishment] || null;
      expense.measure_uuid = measureMap[expense.measure] || null;
      expense.currency_uuid = currencyMap[expense.currency] || null;
      delete expense.product;
      delete expense.establishment;
      delete expense.measure;
      delete expense.currency;
      return expense;
    });
    await queryInterface.bulkInsert('expenses', updatedExpenses, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('expenses', null, {});
  },
};
