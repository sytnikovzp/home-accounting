const {
  seeders: { categories },
} = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('categories', categories, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
