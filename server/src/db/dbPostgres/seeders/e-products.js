const { postgresData } = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    const { products } = await postgresData();
    await queryInterface.bulkInsert('products', products, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
  },
};
