"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CATEGORY_SERVICE_MAP extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  CATEGORY_SERVICE_MAP.init(
    {
      SERVICE_ID: DataTypes.INTEGER,
      CATEGORY_SERVICE_ID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CATEGORY_SERVICE_MAP",
    }
  );
  return CATEGORY_SERVICE_MAP;
};
