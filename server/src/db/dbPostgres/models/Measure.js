const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Measure extends Model {
    static associate(models) {
      Measure.hasMany(models.Purchase, {
        foreignKey: 'measureUuid',
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
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [0, 100],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: {
          len: [0, 100],
        },
      },
      creatorUuid: {
        type: DataTypes.UUID,
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
      timestamps: true,
      underscored: true,
    }
  );
  return Measure;
};
