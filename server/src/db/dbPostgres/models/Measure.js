const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Measure extends Model {
    static associate(models) {
      Measure.hasMany(models.Expense, {
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
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          len: [1, 100],
        },
      },
      description: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          len: [1, 100],
        },
      },
      creatorUuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      creatorFullName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: [1, 100],
        },
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
