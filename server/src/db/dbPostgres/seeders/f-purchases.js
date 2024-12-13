/* eslint-disable camelcase */
const { Product, Shop, Measure, Currency } = require('../models');
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
      const shop = await Shop.findOne({
        where: { title: purchase.shop },
      });
      if (shop) {
        purchase.shop_uuid = shop.uuid;
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
      delete purchase.shop;
      delete purchase.measure;
      delete purchase.currency;
    }
    await queryInterface.bulkInsert('purchases', purchases, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('purchases', null, {});
  },
};
