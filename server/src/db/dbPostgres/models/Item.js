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
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });

      Item.belongsTo(models.Measure, {
        foreignKey: 'measure_id',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });

      Item.belongsTo(models.Currency, {
        foreignKey: 'currency_id',
        onDelete: 'SET NULL',
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
