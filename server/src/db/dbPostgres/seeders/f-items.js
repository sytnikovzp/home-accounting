const { items } = require('../../../constants/seeders');

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('items', items, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('items', null, {});
  },
};
