"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GROUP extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      GROUP.hasMany(models.USER, { foreignKey: "GROUP_ID" });

      GROUP.belongsToMany(models.ROLE_PERMISSION_APP, {
        through: "GROUP_ROLE",
        foreignKey: "GROUP_ID",
        targetKey: "id",
      });
    }
  }
  GROUP.init(
    {
      NAME_VI: DataTypes.STRING,
      NAME_EN: DataTypes.STRING,
      DESCRIPTION: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "GROUP",
    }
  );
  return GROUP;
};
