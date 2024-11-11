const { postgresData } = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    const { purchases } = await postgresData();
    await queryInterface.bulkInsert('purchases', purchases, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('purchases', null, {});
  },
};
