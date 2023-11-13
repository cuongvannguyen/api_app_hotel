"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CHANNEL_LOG extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  CHANNEL_LOG.init(
    {
      CHANNEL_ID: DataTypes.INTEGER,
      CHANNEL_NAME_VI: DataTypes.STRING,
      CHANNEL_NAME_EN: DataTypes.STRING,
      CHANNEL_NAME_CATCHUP: DataTypes.STRING,
      CHANNEL_STATUS: DataTypes.INTEGER,

      CHANNEL_ORDER: DataTypes.INTEGER,
      CHANNEL_POSTER: DataTypes.STRING,
      CHANNEL_POSTER_HIGH_QUALITY: DataTypes.STRING,
      CHANNEL_URL_HLS: DataTypes.STRING,

      CHANNEL_PROFILE_URL: DataTypes.STRING,
      CHANNEL_MULTICAST: DataTypes.STRING,
      CHANNEL_MULTICAST_URL: DataTypes.STRING,
      CHANNEL_DRM: DataTypes.STRING,

      CHANNEL_QUALITY: DataTypes.STRING,
      LOGO_X: DataTypes.STRING,
      LOGO_Y: DataTypes.STRING,
      ACTION_LOG: DataTypes.STRING,
      USER_ID_UPDATE: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CHANNEL_LOG",
    }
  );
  return CHANNEL_LOG;
};
