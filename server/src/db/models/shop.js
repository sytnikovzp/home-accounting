'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shop extends Model {
    static associate(models) {
      shop.hasMany(models.item, {
        foreignKey: 'shop_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  shop.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: DataTypes.TEXT,
      url: {
        type: DataTypes.STRING,
        unique: true,
      },
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'shop',
    }
  );
  return shop;
};
