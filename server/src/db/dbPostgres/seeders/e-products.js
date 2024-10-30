const {
  postgresData: { products },
} = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('products', products, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('products', null, {});
  },
};
