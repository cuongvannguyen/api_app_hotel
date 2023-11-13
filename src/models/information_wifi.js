"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class INFORMATION_WIFI extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      INFORMATION_WIFI.hasMany(models.ROOM, { foreignKey: "WIFI_ID" });
    }
  }
  INFORMATION_WIFI.init(
    {
      SSID: DataTypes.STRING,
      PASSWORD: DataTypes.STRING,
      POSSITION: DataTypes.STRING,
      STATUS: DataTypes.INTEGER,
      NOTE: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "INFORMATION_WIFI",
    }
  );
  return INFORMATION_WIFI;
};
