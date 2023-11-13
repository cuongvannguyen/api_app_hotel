"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CATEGORY_EXPLORE extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CATEGORY_EXPLORE.hasMany(models.EXPLORE_HOTEL, {
        foreignKey: "SERVICE_ID",
      });
    }
  }
  CATEGORY_EXPLORE.init(
    {
      CATEGORY_NAME_VI: DataTypes.STRING,
      CATEGORY_NAME_EN: DataTypes.STRING,
      CATEGORY_ICON: DataTypes.STRING,
      SORT_ORDER: DataTypes.INTEGER,
      URL_EXPLORE: DataTypes.STRING,
      STATUS: DataTypes.INTEGER,
      NOTE: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CATEGORY_EXPLORE",
    }
  );
  return CATEGORY_EXPLORE;
};
