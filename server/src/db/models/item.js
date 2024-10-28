'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  item.init(
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      amount: DataTypes.DECIMAL(10, 2),
      price: DataTypes.DECIMAL(10, 2),
      summ: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      shop_id: DataTypes.INTEGER,
      measure_id: DataTypes.INTEGER,
      currency_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'item',
    }
  );
  return item;
};
