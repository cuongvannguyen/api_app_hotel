"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CONTENT_SIDEBAR extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  CONTENT_SIDEBAR.init(
    {
      NAME_VI: DataTypes.STRING,
      NAME_EN: DataTypes.STRING,
      CONTENT_ICON_LINK: DataTypes.STRING,
      CONTENT_ICON_PATH: DataTypes.STRING,
      CONTENT_ICON_IMG: DataTypes.STRING,
      SORT_ORDER: DataTypes.INTEGER,
      URL_SIDEBAR: DataTypes.STRING,
      STATUS: DataTypes.INTEGER,
      NOTE: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CONTENT_SIDEBAR",
    }
  );
  return CONTENT_SIDEBAR;
};
