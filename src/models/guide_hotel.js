"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GUIDE_HOTEL extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GUIDE_HOTEL.belongsTo(models.CATEGORY_GUIDE, {
        foreignKey: "SERVICE_ID",
        targetKey: "id",
      });
    }
  }
  GUIDE_HOTEL.init(
    {
      SERVICE_ID: DataTypes.INTEGER,
      SERVICE_PATH: DataTypes.STRING,
      SERVICE_LINK: DataTypes.STRING,
      TITLE_VI: DataTypes.STRING,
      TITLE_EN: DataTypes.STRING,
      SERVICE_DESCRIPTION_VI: DataTypes.TEXT("long"),
      SERVICE_DESCRIPTION_EN: DataTypes.TEXT("long"),
      IS_SHOW_TEXT: DataTypes.INTEGER,
      ORDER: DataTypes.INTEGER,
      STATUS: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "GUIDE_HOTEL",
    }
  );
  return GUIDE_HOTEL;
};
