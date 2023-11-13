"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class API_LOG_ALL extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  API_LOG_ALL.init(
    {
      NAME_API: DataTypes.STRING,
      DEVICE_ID: DataTypes.INTEGER,
      PARAMS: DataTypes.STRING,
      IP_CLIENT: DataTypes.STRING,
      NOTE: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "API_LOG_ALL",
    }
  );
  return API_LOG_ALL;
};
