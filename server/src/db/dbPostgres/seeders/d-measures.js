const { postgresData } = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    const { measures } = await postgresData();
    await queryInterface.bulkInsert('measures', measures, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('measures', null, {});
  },
};
