const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Shop extends Model {
    static associate(models) {
      Shop.hasMany(models.Item, {
        foreignKey: 'shop_id',
        onDelete: 'SET NULL',
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
      image: DataTypes.STRING,
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
