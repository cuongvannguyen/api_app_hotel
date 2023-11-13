"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CHANNEL_CATE extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CHANNEL_CATE.belongsToMany(models.CHANNEL, {
        through: "CHANNEL_CATE_MAP",
        foreignKey: "CATE_ID",
      });
    }
  }
  CHANNEL_CATE.init(
    {
      CATE_NAME_VI: DataTypes.STRING,
      CATE_NAME_EN: DataTypes.STRING,
      SORT_ORDER: DataTypes.INTEGER,
      CATE_POSTER: DataTypes.STRING,
      CATE_ICON: DataTypes.STRING,
      CATE_STATUS: DataTypes.INTEGER,
      DESCRIPTION: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CHANNEL_CATE",
    }
  );
  return CHANNEL_CATE;
};
