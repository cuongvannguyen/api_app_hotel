"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CHANNEL extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CHANNEL.belongsToMany(models.CHANNEL_CATE, {
        through: "CHANNEL_CATE_MAP",
        foreignKey: "CHANNEL_ID",
      });
    }
  }
  CHANNEL.init(
    {
      CHANNEL_NAME_VI: DataTypes.STRING,
      CHANNEL_NAME_EN: DataTypes.STRING,
      CHANNEL_NAME_CATCHUP: DataTypes.STRING,
      CHANNEL_STATUS: DataTypes.INTEGER,

      CHANNEL_ORDER: DataTypes.INTEGER,
      CHANNEL_LINK: DataTypes.STRING,
      CHANNEL_PATH: DataTypes.STRING,
      CHANNEL_URL_HLS: DataTypes.STRING,

      CHANNEL_PROFILE_URL: DataTypes.STRING,
      CHANNEL_MULTICAST: DataTypes.STRING,
      CHANNEL_MULTICAST_URL: DataTypes.STRING,
      CHANNEL_DRM: DataTypes.STRING,

      CHANNEL_QUALITY: DataTypes.STRING,
      MULTICAST_IP: DataTypes.STRING,
      MULTICAST_PORT: DataTypes.STRING,
      USER_ID_UPDATE: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CHANNEL",
    }
  );
  return CHANNEL;
};
