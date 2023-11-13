"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DEVICE_MEMBER extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DEVICE_MEMBER.belongsTo(models.ROOM, {
        foreignKey: "ROOM_ID",
        targetKey: "id",
      });
    }
  }
  DEVICE_MEMBER.init(
    {
      DEVICE_MANAGE_ID: DataTypes.INTEGER,
      ROOM_ID: DataTypes.INTEGER,
      SERVICE_TYPE: DataTypes.STRING,
      DEVICE_PLAYER_TYPE: DataTypes.STRING,
      MAC_DEVICE: DataTypes.STRING,
      SERI_DEVICE: DataTypes.STRING,
      STATUS_DEVICE: DataTypes.INTEGER,
      SSID: DataTypes.STRING,
      LAST_LOGIN_DATE: DataTypes.DATE,
      LAST_LOGIN_IP: DataTypes.STRING,
      NOTE: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "DEVICE_MEMBER",
    }
  );
  return DEVICE_MEMBER;
};
