"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ALLOW_MAC extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  ALLOW_MAC.init(
    {
      MAC: DataTypes.STRING,
      MODEL: DataTypes.STRING,
      VENDOR: DataTypes.STRING,
      DATE_RELEASE: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ALLOW_MAC",
    }
  );
  return ALLOW_MAC;
};
