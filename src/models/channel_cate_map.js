"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CHANNEL_CATE_MAP extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  CHANNEL_CATE_MAP.init(
    {
      CHANNEL_ID: DataTypes.INTEGER,
      CATE_ID: DataTypes.INTEGER,
      CHANNEL_ORDER: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CHANNEL_CATE_MAP",
    }
  );
  return CHANNEL_CATE_MAP;
};
