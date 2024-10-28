const {
  seeders: { measures },
} = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('measures', measures, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('measures', null, {});
  },
};
