'use strict';

const { measures } = require('../../constants/seeders');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('measures', measures, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('measures', null, {});
  },
};
