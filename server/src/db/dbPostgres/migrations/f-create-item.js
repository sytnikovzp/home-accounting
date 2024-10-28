'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
      },
      summ: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      shop_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'shops',
          key: 'id',
        },
      },
      measure_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'measures',
          key: 'id',
        },
      },
      currency_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'currencies',
          key: 'id',
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('items');
  },
};
