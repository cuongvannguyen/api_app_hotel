"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CHANNEL_SCHEDULE extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  CHANNEL_SCHEDULE.init(
    {
      CHANNEL_ID: DataTypes.INTEGER,
      SCHEDULE_BEGINDATE: DataTypes.DATE,
      SCHEDULE_ENDATE: DataTypes.DATE,
      SCHEDULE_CONTENT: DataTypes.STRING,
      VOD_CATCHUP_ID: DataTypes.INTEGER,
      SCHEDULE_STATUS: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CHANNEL_SCHEDULE",
    }
  );
  return CHANNEL_SCHEDULE;
};
