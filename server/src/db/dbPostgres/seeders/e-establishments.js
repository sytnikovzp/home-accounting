const { postgresData } = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    const { establishments } = await postgresData();
    await queryInterface.bulkInsert('establishments', establishments, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('establishments', null, {});
  },
};
