/* eslint-disable camelcase */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );
    await queryInterface.createTable('categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false,
        unique: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM('approved', 'rejected', 'pending'),
        allowNull: false,
        defaultValue: 'pending',
      },
      moderator_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      moderator_full_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      creator_id: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('categories');
  },
};
