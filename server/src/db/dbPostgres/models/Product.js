const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, {
        foreignKey: 'categoryUuid',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
      Product.hasMany(models.Expense, {
        foreignKey: 'productUuid',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Product.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          len: [1, 100],
        },
      },
      categoryUuid: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('approved', 'rejected', 'pending'),
        allowNull: false,
        defaultValue: 'pending',
      },
      moderatorUuid: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      moderatorFullName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: [0, 100],
        },
      },
      creatorUuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      creatorFullName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: [1, 100],
        },
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      timestamps: true,
      underscored: true,
    }
  );
  return Product;
};
