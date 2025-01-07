/* eslint-disable camelcase */
const { Category } = require('../models');

const { postgresData } = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    const { products } = await postgresData();
    for (const product of products) {
      const category = await Category.findOne({
        where: { title: product.category },
      });
      if (category) {
        product.category_uuid = category.uuid;
      }
      delete product.category;
    }
    await queryInterface.bulkInsert('products', products, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
  },
};
