/* eslint-disable sort-keys-fix/sort-keys-fix */
/* eslint-disable camelcase */
const { Category } = require('../models');

const { postgresData } = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    const { products } = await postgresData();
    const categories = await Category.findAll({
      attributes: ['uuid', 'title'],
    });
    const categoryMap = categories.reduce((acc, category) => {
      acc[category.title] = category.uuid;
      return acc;
    }, {});
    const updatedProducts = products.map((product) => {
      const categoryUuid = categoryMap[product.category];
      if (categoryUuid) {
        product.category_uuid = categoryUuid;
      }
      delete product.category;
      return product;
    });
    await queryInterface.bulkInsert('products', updatedProducts, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
  },
};
