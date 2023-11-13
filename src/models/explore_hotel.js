"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EXPLORE_HOTEL extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EXPLORE_HOTEL.belongsTo(models.CATEGORY_EXPLORE, {
        foreignKey: "SERVICE_ID",
        targetKey: "id",
      });
    }
  }
  EXPLORE_HOTEL.init(
    {
      SERVICE_ID: DataTypes.INTEGER,
      SERVICE_PATH: DataTypes.STRING,
      SERVICE_LINK: DataTypes.STRING,
      TITLE_VI: DataTypes.STRING,
      TITLE_EN: DataTypes.STRING,
      SERVICE_DESCRIPTION_VI: DataTypes.STRING,
      SERVICE_DESCRIPTION_EN: DataTypes.STRING,
      IS_SHOW_TEXT: DataTypes.INTEGER,
      ORDER: DataTypes.INTEGER,
      STATUS: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "EXPLORE_HOTEL",
    }
  );
  return EXPLORE_HOTEL;
};
