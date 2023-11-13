"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CATEGORY_MENU extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CATEGORY_MENU.hasMany(models.MENU_HOTEL, {
        foreignKey: "SERVICE_ID",
      });
    }
  }
  CATEGORY_MENU.init(
    {
      CATEGORY_NAME_VI: DataTypes.STRING,
      CATEGORY_NAME_EN: DataTypes.STRING,
      CATEGORY_ICON: DataTypes.STRING,
      SORT_ORDER: DataTypes.INTEGER,
      URL_MENU: DataTypes.STRING,
      STATUS: DataTypes.INTEGER,
      NOTE: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CATEGORY_MENU",
    }
  );
  return CATEGORY_MENU;
};
