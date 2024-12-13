const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Currency extends Model {
    static associate(models) {
      Currency.hasMany(models.Purchase, {
        foreignKey: 'currency_id',
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
      modelName: 'Currency',
      tableName: 'currencies',
      underscored: true,
    }
  );
  return Currency;
};
