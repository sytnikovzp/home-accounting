'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class currency extends Model {
    static associate(models) {
      currency.hasMany(models.item, {
        foreignKey: 'currency_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  currency.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'currency',
    }
  );
  return currency;
};
