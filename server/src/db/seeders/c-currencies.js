'use strict';

const { currencies } = require('../../constants/seeders');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('currencies', currencies, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('currencies', null, {});
  },
};
