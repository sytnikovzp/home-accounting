const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Measure extends Model {
    static associate(models) {
      Measure.hasMany(models.Purchase, {
        foreignKey: 'measure_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Measure.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: DataTypes.TEXT,
      creatorId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      creatorFullName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Measure',
      tableName: 'measures',
      underscored: true,
    }
  );
  return Measure;
};
