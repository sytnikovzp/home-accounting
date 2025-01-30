/* eslint-disable sort-keys-fix/sort-keys-fix */
/* eslint-disable camelcase */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
    await queryInterface.createTable('expenses', {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false,
        primaryKey: true,
        unique: true,
      },
      product_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'products',
          key: 'uuid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      unit_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      establishment_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'establishments',
          key: 'uuid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      measure_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'measures',
          key: 'uuid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      currency_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'currencies',
          key: 'uuid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      creator_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      creator_full_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.sequelize.query(
      'DROP EXTENSION IF EXISTS "uuid-ossp";'
    );
    await queryInterface.dropTable('expenses');
  },
};
