/* eslint-disable camelcase */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('shops', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
      },
      url: {
        type: Sequelize.STRING,
        unique: true,
      },
      logo: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM('approved', 'rejected', 'pending'),
        defaultValue: 'pending',
      },
      reviewed_by: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reviewed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('shops');
  },
};
