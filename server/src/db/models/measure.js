'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class measure extends Model {
    static associate(models) {
      measure.hasMany(models.item, {
        foreignKey: 'measure_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  measure.init(
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
      modelName: 'measure',
    }
  );
  return measure;
};
