const { Model, Sequelize } = require('sequelize');

const { isBeforeCurrentDate } = require('../../../utils/sharedFunctions');

module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    static associate(models) {
      Expense.belongsTo(models.Product, {
        foreignKey: 'productUuid',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Expense.belongsTo(models.Establishment, {
        foreignKey: 'establishmentUuid',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Expense.belongsTo(models.Measure, {
        foreignKey: 'measureUuid',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Expense.belongsTo(models.Currency, {
        foreignKey: 'currencyUuid',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Expense.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false,
        primaryKey: true,
      },
      productUuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
        validate: {
          min: 0,
        },
      },
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
        validate: {
          min: 0,
        },
      },
      totalPrice: {
        type: DataTypes.VIRTUAL,
        get() {
          return (this.quantity * this.unitPrice).toFixed(2);
        },
      },
      establishmentUuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      measureUuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      currencyUuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
          isBeforeCurrentDate,
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
      modelName: 'Expense',
      tableName: 'expenses',
      timestamps: true,
      underscored: true,
    }
  );
  return Expense;
};
