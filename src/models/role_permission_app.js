"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ROLE_PERMISSION_APP extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      ROLE_PERMISSION_APP.belongsToMany(models.GROUP, {
        through: "GROUP_ROLE",
        foreignKey: "ROLE_ID",
        targetKey: "id",
      });
      ROLE_PERMISSION_APP.belongsToMany(models.USER, {
        through: "USER_ROLE",
        foreignKey: "ROLE_ID",
      });
    }
  }
  ROLE_PERMISSION_APP.init(
    {
      URL: DataTypes.STRING,
      DESCRIPTION: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ROLE_PERMISSION_APP",
    }
  );
  return ROLE_PERMISSION_APP;
};
