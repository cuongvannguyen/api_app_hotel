"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ROOM extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ROOM.belongsTo(models.INFORMATION_WIFI, {
        foreignKey: "WIFI_ID",
        targetKey: "id",
      });

      ROOM.belongsTo(models.INFORMATION_HOTEL, {
        foreignKey: "INFORMATION_HOTEL_ID",
        targetKey: "id",
      });

      ROOM.belongsTo(models.GUEST, {
        foreignKey: "id",
        targetKey: "ROOM_ID",
      });
    }
  }
  ROOM.init(
    {
      HOTEL_ID: DataTypes.INTEGER,
      INFORMATION_HOTEL_ID: DataTypes.INTEGER,
      WIFI_ID: DataTypes.INTEGER,
      ROOM_NAME: DataTypes.STRING,
      ROOM_STATUS: DataTypes.INTEGER,
      NOTE: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ROOM",
    }
  );
  return ROOM;
};
