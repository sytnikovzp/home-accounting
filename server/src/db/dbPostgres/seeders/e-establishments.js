const { POSTGRES_DATA } = require('../../../constants');

module.exports = {
  async up(queryInterface) {
    const { establishments } = await POSTGRES_DATA();
    await queryInterface.bulkInsert('establishments', establishments, {});
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('establishments', null, {});
  },
};
