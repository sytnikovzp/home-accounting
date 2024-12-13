const { Model, Sequelize } = require('sequelize');

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
      uuid: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: DataTypes.TEXT,
      creatorId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      creatorFullName: {
        type: DataTypes.STRING,
        allowNull: false,
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
