'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    static associate(models) {
      category.hasMany(models.product, {
        foreignKey: 'category_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  category.init(
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
      modelName: 'category',
    }
  );
  return category;
};
