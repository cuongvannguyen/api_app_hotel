"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DEVICE_PLAYER_TYPE extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  DEVICE_PLAYER_TYPE.init(
    {
      PLAYER_TYPE: DataTypes.STRING,
      DESCRIPTION: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "DEVICE_PLAYER_TYPE",
    }
  );
  return DEVICE_PLAYER_TYPE;
};
