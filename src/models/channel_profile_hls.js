"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CHANNEL_PROFILE_HLS extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  CHANNEL_PROFILE_HLS.init(
    {
      CHANNEL_ID: DataTypes.INTEGER,
      PROFILE_NAME: DataTypes.STRING,
      BITRATE: DataTypes.STRING,
      QUALITY: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CHANNEL_PROFILE_HLS",
    }
  );
  return CHANNEL_PROFILE_HLS;
};
