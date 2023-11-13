"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DEVICE_MANAGE extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  DEVICE_MANAGE.init(
    {
      DEVICE_MODEL: DataTypes.STRING,
      DEVICE_TYPE: DataTypes.STRING,
      VENDOR: DataTypes.STRING,
      DESCRIPTION: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "DEVICE_MANAGE",
    }
  );
  return DEVICE_MANAGE;
};
