const { POSTGRES_DATA } = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    const { measures } = await POSTGRES_DATA();
    await queryInterface.bulkInsert('measures', measures, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('measures', null, {});
  },
};
