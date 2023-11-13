"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CATEGORY_NEWSLETTER extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  CATEGORY_NEWSLETTER.init(
    {
      NEWSLETTER_NAME_VI: DataTypes.STRING,
      NEWSLETTER_NAME_EN: DataTypes.STRING,
      NEWSLETTER_ICON: DataTypes.STRING,
      SORT_ORDER: DataTypes.INTEGER,
      URL_NEWSLETTER: DataTypes.STRING,
      STATUS: DataTypes.INTEGER,
      NOTE: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CATEGORY_NEWSLETTER",
    }
  );
  return CATEGORY_NEWSLETTER;
};
