const { POSTGRES_DATA } = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    const { currencies } = await POSTGRES_DATA();
    await queryInterface.bulkInsert('currencies', currencies, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('currencies', null, {});
  },
};
