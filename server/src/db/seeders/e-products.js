'use strict';

const { products } = require('../../constants/seeders');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', products, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  },
};
