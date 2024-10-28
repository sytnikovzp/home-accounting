const { currencies } = require('../../../constants/seeders');

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('currencies', currencies, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('currencies', null, {});
  },
};
