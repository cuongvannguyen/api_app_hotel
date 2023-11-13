"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GUEST extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GUEST.belongsTo(models.ROOM, {
        foreignKey: "ROOM_ID",
        targetKey: "id",
      });
    }
  }
  GUEST.init(
    {
      ROOM_ID: DataTypes.INTEGER,
      GUEST_NAME: DataTypes.STRING,
      GUEST_IDENTIFY_CARD: DataTypes.STRING,
      BOOK_CHECK_IN_DATE: DataTypes.DATE,
      BOOK_CHECK_OUT_DATE: DataTypes.DATE,
      NOTE: DataTypes.STRING,
      STATUS: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "GUEST",
    }
  );
  return GUEST;
};
