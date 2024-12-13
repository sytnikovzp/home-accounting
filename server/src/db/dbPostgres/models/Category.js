const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Product, {
        foreignKey: 'category_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Category.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.ENUM('approved', 'rejected', 'pending'),
        allowNull: false,
        defaultValue: 'pending',
      },
      moderatorId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      moderatorFullName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      creatorId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      creatorFullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Category',
      tableName: 'categories',
      underscored: true,
    }
  );
  return Category;
};
