"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NEWSLETTER_HOTEL extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  NEWSLETTER_HOTEL.init(
    {
      CATALOGUE_NEWSLETTER: DataTypes.STRING,
      DESCRIPTION_NEWSLETTER: DataTypes.STRING,
      ICON_NEWSLETTER: DataTypes.STRING,
      STATUS: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "NEWSLETTER_HOTEL",
    }
  );
  return NEWSLETTER_HOTEL;
};
