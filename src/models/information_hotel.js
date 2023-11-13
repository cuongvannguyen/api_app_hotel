"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class INFORMATION_HOTEL extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      INFORMATION_HOTEL.hasMany(models.ROOM, {
        foreignKey: "INFORMATION_HOTEL_ID",
      });
    }
  }
  INFORMATION_HOTEL.init(
    {
      SUBJECT: DataTypes.STRING,
      BACKGROUND_LINK: DataTypes.STRING,
      BACKGROUND_PATH: DataTypes.STRING,
      OPEN_LETTER_VI: DataTypes.TEXT("long"),
      CONTENT_TITLE_VI: DataTypes.STRING,
      OPEN_LETTER_EN: DataTypes.TEXT("long"),
      CONTENT_TITLE_EN: DataTypes.STRING,
      STATUS: DataTypes.INTEGER,
      NOTE: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "INFORMATION_HOTEL",
    }
  );
  return INFORMATION_HOTEL;
};
