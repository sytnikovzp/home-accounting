const {
  postgresData: { shops },
} = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('shops', shops, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('shops', null, {});
  },
};
