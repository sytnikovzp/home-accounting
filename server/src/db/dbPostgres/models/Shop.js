const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Shop extends Model {
    static associate(models) {
      Shop.hasMany(models.Purchase, {
        foreignKey: 'shop_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Shop.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: DataTypes.TEXT,
      url: {
        type: DataTypes.STRING,
        unique: true,
      },
      logo: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM('approved', 'rejected', 'pending'),
        allowNull: false,
        defaultValue: 'pending',
      },
      moderatorId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      moderatorFullName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
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
      modelName: 'Shop',
      tableName: 'shops',
      underscored: true,
    }
  );
  return Shop;
};
