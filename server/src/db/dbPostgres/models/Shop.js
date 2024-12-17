const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Shop extends Model {
    static associate(models) {
      Shop.hasMany(models.Purchase, {
        foreignKey: 'shopUuid',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Shop.init(
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
      modelName: 'Shop',
      tableName: 'shops',
      timestamps: true,
      underscored: true,
    }
  );
  return Shop;
};
