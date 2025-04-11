const { POSTGRES_DATA } = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    const { categories } = await POSTGRES_DATA();
    await queryInterface.bulkInsert('categories', categories, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
