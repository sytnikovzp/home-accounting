const { postgresData } = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    const { shops } = await postgresData();
    await queryInterface.bulkInsert('shops', shops, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('shops', null, {});
  },
};
