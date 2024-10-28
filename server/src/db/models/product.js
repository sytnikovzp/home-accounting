'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    static associate(models) {
      product.belongsTo(models.category, {
        foreignKey: 'category_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });

      product.hasMany(models.item, {
        foreignKey: 'product_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  product.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      category_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'product',
    }
  );
  return product;
};
