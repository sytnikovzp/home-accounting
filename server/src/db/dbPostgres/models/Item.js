const { Model } = require('sequelize');

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
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      summ: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      shopId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      measureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currencyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
