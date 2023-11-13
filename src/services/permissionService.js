import db from "../models/index";
require("dotenv").config();
import mysql from "mysql2/promise";
import bluebird from "bluebird";
import { Op } from "sequelize";
const fs = require("fs");

const handleCreatePermission = async (permissions) => {
  try {
    if (
      !permissions ||
      !permissions.permission_name ||
      !permissions.permissions
    ) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      //handle create permissions
      let permissionName = await db.PERMISSION.findOne({
        where: { PERMISSION_NAME: permissions.permission_name },
        attributes: ["id"],
        raw: true,
      });
      if (permissionName) {
        return {
          EM: "Permission name is exit, Please create new pemission again!",
          EC: 1,
          DT: "",
        };
      } else {
        await db.PERMISSION.create({
          PERMISSION_NAME: permissions.permission_name,
          PERMISSION_PARENT: 0,
          PERMISSION_STATUS: 1,
        });

        const connection = await mysql.createConnection({
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE_NAME,
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          Promise: bluebird,
        });

        const [countIdMaxPermission, fields] = await connection.execute(
          `SELECT MAX(id) AS ID FROM PERMISSION;
          `
        );

        //so sanh tim Ptu moi
        let permissionArray = permissions.permissions;

        let currentPermissions = await db.PERMISSION.findAll({
          attributes: ["URL", "DESCRIPTION"],
          raw: true,
        });

        const persists = permissionArray.filter(
          ({ URL: URL1 }) =>
            !currentPermissions.some(({ URL: URL2 }) => URL1 === URL2)
        );

        if (persists.length === 0) {
          return {
            EM: "Nothing Permission to create....",
            EC: 0,
            DT: "",
          };
        }

        if (countIdMaxPermission && persists) {
          console.log("check persists: ", countIdMaxPermission);
          let dataPermissionCreate = [];
          persists.map((item) => {
            let object = {};
            object.URL = item.URL;
            object.DESCRIPTION = item.DESCRIPTION;
            object.PERMISSION_PARENT = countIdMaxPermission[0].ID;
            object.PERMISSION_STATUS = 1;
            dataPermissionCreate.push(object);
          });

          await db.PERMISSION.bulkCreate(dataPermissionCreate);
          return {
            EM: `Create New succeeds ${persists.length} Permission....`,
            EC: 0,
            DT: [],
          };
        } else {
          return {
            EM: "Create permission fail!",
            EC: 1,
            DT: "",
          };
        }
      }
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: "",
    };
  }
};

const handleReadPermission = async () => {
  try {
    const connection = await mysql.createConnection({
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      Promise: bluebird,
    });

    let query = `SELECT a.*, a_group.Count AS "CountRole" 
    FROM PERMISSION a  LEFT OUTER JOIN (SELECT PERMISSION_PARENT, COUNT(*) AS Count FROM PERMISSION GROUP BY PERMISSION_PARENT) a_group ON a.id = a_group.PERMISSION_PARENT
    where a.PERMISSION_PARENT = 0;`;
    const [permissionParent, parent] = await connection.execute(query);

    let resultPerssion = [];
    if (permissionParent) {
      for (let i = 0; i < permissionParent.length; i++) {
        let permission = permissionParent[i];
        let arrResult = {};

        const [permissionChildrent, childrent] = await connection.execute(
          `SELECT * FROM PERMISSION where PERMISSION_PARENT=?`,
          [permission.id]
        );

        if (permissionChildrent) {
          let result = {
            ...arrResult,
            permission,
            permissionChildrent,
          };
          resultPerssion.push(result);
        }
      }

      return {
        EM: "get all test permission success!",
        EC: 0,
        DT: resultPerssion,
      };
    } else {
      return {
        EM: "get all permission Fail",
        EC: 1,
        DT: "",
      };
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};

const getPermissionByRole = async (id) => {
  try {
    if (!id) {
      return {
        EM: `Missing paramters groupId (Role)`,
        EC: 1,
        DT: "",
      };
    }
    let roles = await db.GROUP.findOne({
      where: { id: id },
      attributes: ["id", "NAME_VI", "NAME_EN", "DESCRIPTION"],

      include: [
        {
          model: db.PERMISSION,
          attributes: [
            "id",
            "URL",
            "DESCRIPTION",
            "PERMISSION_STATUS",
            "PERMISSION_NAME",
          ],
          through: { attributes: [] },
        },
      ],
    });

    return {
      EM: `Get Permission By Role Succeeds`,
      EC: 0,
      DT: roles,
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};

const assignPermissionToRole = async (data) => {
  try {
    if (!data) {
      return {
        EM: `Missing paramters data`,
        EC: 0,
        DT: "",
      };
    }

    let findGroupRole = await db.PERMISSION_ROLE.findOne({
      where: { GROUP_ID: +data.data.selectedRole },
      raw: true,
    });

    if (findGroupRole) {
      await db.PERMISSION_ROLE.destroy({
        where: { GROUP_ID: +data.data.selectedRole },
      });
    }
    await db.PERMISSION_ROLE.bulkCreate(data.data.rolePermissions);
    return {
      EM: `Assign Roles-Permissions success!`,
      EC: 0,
      DT: "",
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};

const handleDeletePermission = async (dataDelete) => {
  try {
    if (!dataDelete || !dataDelete.id) {
      return {
        EM: `Missing paramters data`,
        EC: 1,
        DT: "",
      };
    } else {
      if (dataDelete && dataDelete.id) {
        await db.PERMISSION.destroy({
          where: {
            [Op.and]: [
              { id: dataDelete.id },
              { PERMISSION_PARENT: dataDelete.permissionsParents },
            ],
          },
        });

        if (dataDelete.children) {
          dataDelete.children.forEach(async (item) => {
            await db.PERMISSION.destroy({
              where: {
                [Op.and]: [
                  { id: item.key },
                  { PERMISSION_PARENT: item.PERMISSION_PARENT },
                ],
              },
            });
            await db.PERMISSION_ROLE.destroy({
              where: {
                PERMISSION_ID: item.key,
              },
            });
          });
        }

        return {
          EM: "Delete permission success!",
          EC: 0,
          DT: "",
        };
      }
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};

const handleUpdatePermission = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let permission = await db.PERMISSION.findOne({
        where: {
          [Op.and]: [
            { id: data.key },
            { PERMISSION_PARENT: data.PERMISSION_PARENT },
          ],
        },
      });

      if (permission) {
        await permission.update({
          PERMISSION_NAME: data.PERMISSION_NAME ? data.PERMISSION_NAME : "",
          URL: data.URL ? data.URL : "",
          DESCRIPTION: data.DESCRIPTION ? data.DESCRIPTION : "",
        });
        return {
          EM: "Update Permission success!",
          EC: 0,
          DT: "",
        };
      } else {
        return {
          EM: "Update Permission fail!",
          EC: 0,
          DT: "",
        };
      }
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs this service",
      EC: 2,
      DT: "",
    };
  }
};

module.exports = {
  handleCreatePermission,
  handleReadPermission,
  getPermissionByRole,
  assignPermissionToRole,
  handleDeletePermission,
  handleUpdatePermission,
};
