"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class USER extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      USER.belongsTo(models.GROUP, {
        foreignKey: "GROUP_ID",
        targetKey: "id",
      });

      USER.belongsToMany(models.ROLE_PERMISSION_APP, {
        through: "USER_ROLE",
        foreignKey: "USER_ID",
      });
    }
  }
  USER.init(
    {
      _id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      EMAIL: DataTypes.STRING,
      PASSWORD: DataTypes.STRING,
      USER_LASTNAME: DataTypes.STRING,
      USER_FIRSTNAME: DataTypes.STRING,
      USER_STATUS: DataTypes.INTEGER,
      GROUP_ID: DataTypes.INTEGER,
      POSITION_ID: DataTypes.INTEGER,
      USER_GENDER: DataTypes.STRING,
      AVATAR_LINK: DataTypes.STRING,
      AVATAR_PATH: DataTypes.STRING,
      USER_PHONE: DataTypes.STRING,
      LAST_LOGIN_DATE: DataTypes.DATE,
      LAST_LOGIN_IP: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "USER",
    }
  );
  return USER;
};
