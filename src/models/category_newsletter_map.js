"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CATEGORY_NEWSLETTER_MAP extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  CATEGORY_NEWSLETTER_MAP.init(
    {
      NEWSLETTER_ID: DataTypes.INTEGER,
      CATEGORY_NEWSLETTER_ID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CATEGORY_NEWSLETTER_MAP",
    }
  );
  return CATEGORY_NEWSLETTER_MAP;
};
