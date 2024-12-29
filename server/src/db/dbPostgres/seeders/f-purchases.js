/* eslint-disable camelcase */
const { Product, Establishment, Measure, Currency } = require('../models');
const { postgresData } = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    const { purchases } = await postgresData();
    for (const purchase of purchases) {
      const product = await Product.findOne({
        where: { title: purchase.product },
      });
      if (product) {
        purchase.product_uuid = product.uuid;
      }
      const establishment = await Establishment.findOne({
        where: { title: purchase.establishment },
      });
      if (establishment) {
        purchase.establishment_uuid = establishment.uuid;
      }
      const measure = await Measure.findOne({
        where: { title: purchase.measure },
      });
      if (measure) {
        purchase.measure_uuid = measure.uuid;
      }
      const currency = await Currency.findOne({
        where: { title: purchase.currency },
      });
      if (currency) {
        purchase.currency_uuid = currency.uuid;
      }
      delete purchase.product;
      delete purchase.establishment;
      delete purchase.measure;
      delete purchase.currency;
    }
    await queryInterface.bulkInsert('purchases', purchases, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('purchases', null, {});
  },
};
