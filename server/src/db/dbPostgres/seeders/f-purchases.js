const {
  postgresData: { purchases },
} = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('purchases', purchases, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('purchases', null, {});
  },
};
