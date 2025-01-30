/* eslint-disable sort-keys-fix/sort-keys-fix */
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Establishment extends Model {
    static associate(models) {
      Establishment.hasMany(models.Expense, {
        foreignKey: 'establishmentUuid',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Establishment.init(
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
        validate: {
          len: [0, 100],
        },
      },
      url: {
        type: DataTypes.STRING,
        unique: true,
      },
      logo: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          len: [0, 100],
        },
      },
      status: {
        type: DataTypes.ENUM('approved', 'rejected', 'pending'),
        allowNull: false,
        defaultValue: 'pending',
      },
      moderatorUuid: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      moderatorFullName: {
        type: DataTypes.STRING,
        allowNull: true,
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
      modelName: 'Establishment',
      tableName: 'establishments',
      timestamps: true,
      underscored: true,
    }
  );
  return Establishment;
};
