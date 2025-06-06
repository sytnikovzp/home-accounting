/* eslint-disable camelcase */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
    await queryInterface.createTable('establishments', {
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      url: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      logo: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM('approved', 'rejected', 'pending'),
        allowNull: false,
        defaultValue: 'pending',
      },
      moderator_uuid: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      moderator_full_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      creator_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      creator_full_name: {
        type: Sequelize.STRING(100),
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
    await queryInterface.dropTable('establishments');
  },
};
