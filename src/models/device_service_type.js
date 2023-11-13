"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DEVICE_SERVICE_TYPE extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  DEVICE_SERVICE_TYPE.init(
    {
      TYPE_NAME: DataTypes.STRING,
      DESCRIPTION: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "DEVICE_SERVICE_TYPE",
    }
  );
  return DEVICE_SERVICE_TYPE;
};
