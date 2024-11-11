const { postgresData } = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    const { currencies } = await postgresData();
    await queryInterface.bulkInsert('currencies', currencies, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('currencies', null, {});
  },
};
