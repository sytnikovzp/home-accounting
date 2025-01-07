/* eslint-disable camelcase */
const { Product, Establishment, Measure, Currency } = require('../models');

const { postgresData } = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    const { expenses } = await postgresData();
    for (const expense of expenses) {
      const product = await Product.findOne({
        where: { title: expense.product },
      });
      if (product) {
        expense.product_uuid = product.uuid;
      }
      const establishment = await Establishment.findOne({
        where: { title: expense.establishment },
      });
      if (establishment) {
        expense.establishment_uuid = establishment.uuid;
      }
      const measure = await Measure.findOne({
        where: { title: expense.measure },
      });
      if (measure) {
        expense.measure_uuid = measure.uuid;
      }
      const currency = await Currency.findOne({
        where: { title: expense.currency },
      });
      if (currency) {
        expense.currency_uuid = currency.uuid;
      }
      delete expense.product;
      delete expense.establishment;
      delete expense.measure;
      delete expense.currency;
    }
    await queryInterface.bulkInsert('expenses', expenses, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('expenses', null, {});
  },
};
