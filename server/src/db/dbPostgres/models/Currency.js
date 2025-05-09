const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Currency extends Model {
    static associate(models) {
      Currency.hasMany(models.Expense, {
        foreignKey: 'currencyUuid',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Currency.init(
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
      code: {
        type: DataTypes.STRING(3),
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 3],
          isUppercase: true,
          is: /^[A-Z]{3}$/,
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
      modelName: 'Currency',
      tableName: 'currencies',
      timestamps: true,
      underscored: true,
    }
  );
  return Currency;
};
