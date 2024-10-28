'use strict';

const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.belongsTo(models.Product, {
        foreignKey: 'product_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Item.belongsTo(models.Shop, {
        foreignKey: 'shop_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Item.belongsTo(models.Measure, {
        foreignKey: 'measure_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      Item.belongsTo(models.Currency, {
        foreignKey: 'currency_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Item.init(
    {
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: DataTypes.DECIMAL(10, 2),
      price: DataTypes.DECIMAL(10, 2),
      summ: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      shopId: DataTypes.INTEGER,
      measureId: DataTypes.INTEGER,
      currencyId: DataTypes.INTEGER,
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    },
    {
      sequelize,
      modelName: 'Item',
      tableName: 'items',
      underscored: true,
    }
  );
  return Item;
};
