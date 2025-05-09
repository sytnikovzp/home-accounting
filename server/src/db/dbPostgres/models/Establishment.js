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
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          len: [1, 100],
        },
      },
      description: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: [0, 100],
        },
      },
      url: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true,
        validate: {
          isUrl: true,
          len: [0, 100],
        },
      },
      logo: {
        type: DataTypes.STRING(100),
        allowNull: true,
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
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: [0, 100],
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
      modelName: 'Establishment',
      tableName: 'establishments',
      timestamps: true,
      underscored: true,
    }
  );
  return Establishment;
};
