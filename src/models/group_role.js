"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GROUP_ROLE extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  GROUP_ROLE.init(
    {
      GROUP_ID: DataTypes.INTEGER,
      ROLE_ID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "GROUP_ROLE",
    }
  );
  return GROUP_ROLE;
};
