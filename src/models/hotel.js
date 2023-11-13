"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class HOTEL extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HOTEL.init(
    {
      HOTEL_NAME: DataTypes.STRING,
      ADDRESS: DataTypes.STRING,
      HOTLINE: DataTypes.STRING,
      HOTEL_START: DataTypes.STRING,
      LATITUDE: DataTypes.STRING,
      LONGGITUDE: DataTypes.STRING,
      DEVICE_COUNT: DataTypes.INTEGER,
      SLOGAN_VI: DataTypes.STRING,
      SLOGAN_EN: DataTypes.STRING,
      LOGO_HORIZONTAL_LINK: DataTypes.STRING,
      LOGO_VERTICAL_LINK: DataTypes.STRING,
      LOGO_MIN_LINK: DataTypes.STRING,
      LOGO_HORIZONTAL_PATH: DataTypes.STRING,
      LOGO_VERTICAL_PATH: DataTypes.STRING,
      LOGO_MIN_PATH: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "HOTEL",
    }
  );
  return HOTEL;
};
