"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class APP_LOGIN extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  APP_LOGIN.init(
    {
      APP_NAME: DataTypes.STRING,
      APP_TITLE: DataTypes.DATE,
      APP_BACKGROUND: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "APP_LOGIN",
    }
  );
  return APP_LOGIN;
};
