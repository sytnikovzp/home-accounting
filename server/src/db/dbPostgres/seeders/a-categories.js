/* eslint-disable sort-keys-fix/sort-keys-fix */
const { postgresData } = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    const { categories } = await postgresData();
    await queryInterface.bulkInsert('categories', categories, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
