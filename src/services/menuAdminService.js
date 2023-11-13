import db from "../models/index";
require("dotenv").config();
import mysql from "mysql2/promise";
import bluebird from "bluebird";
import { Op } from "sequelize";
const fs = require("fs");

const handleCreateMenuAdminItem = async (menuAdmin) => {
  try {
    if (!menuAdmin) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      await db.MENU_ADMIN.create({
        MENU_NAME_EN: menuAdmin.MENU_NAME_EN,
        MENU_NAME_VI: menuAdmin.MENU_NAME_VI,
        MENU_STATUS: 1,
        MENU_LINK: menuAdmin.MENU_LINK,
        MENU_PARENT: menuAdmin.MENU_PARENT,
        MENU_LEVER: menuAdmin.MENU_LEVER,
        MENU_ORDER: menuAdmin.MENU_ORDER,
        MENU_ICON: menuAdmin.MENU_ICON,
        MENU_REACT: menuAdmin.MENU_REACT,
        MENU_BULLET: menuAdmin.MENU_BULLET ? 1 : 0,
        MENU_CATEGORY: menuAdmin.MENU_CATEGORY,
      });

      return {
        EM: "Create Menu Admin Item success!",
        EC: 0,
        DT: "",
      };
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

const handleCreateMenuAdmin = async (menuAdmin) => {
  try {
    if (!menuAdmin) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      await db.MENU_ADMIN.create({
        MENU_NAME_EN: menuAdmin.MENU_NAME_EN,
        MENU_NAME_VI: menuAdmin.MENU_NAME_VI,
        MENU_STATUS: 1,
        MENU_LINK: menuAdmin.MENU_LINK,
        MENU_PARENT: 0,
        MENU_LEVER: 1,
        MENU_ORDER: menuAdmin.MENU_ORDER,
        MENU_ICON: menuAdmin.MENU_ICON,
        MENU_REACT: menuAdmin.MENU_REACT,
        MENU_BULLET: menuAdmin.MENU_BULLET ? 1 : 0,
        MENU_CATEGORY: menuAdmin.MENU_CATEGORY,
      });

      return {
        EM: "Create Menu Admin success!",
        EC: 0,
        DT: "",
      };
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

const handleMenuDisplay = async (data) => {
  try {
    const connection = await mysql.createConnection({
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      Promise: bluebird,
    });

    if (!data && !data.groupId) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let query = `SELECT au.* FROM ADMIN_GROUP_MENU agm JOIN MENU_ADMIN au ON agm.MENU_ID = au.id WHERE au.MENU_LEVER = 1 AND agm.GROUP_ID = ? ORDER BY au.MENU_ORDER;`;
      const [menuParent, parent] = await connection.execute(query, [
        data.groupId,
      ]);

      if (menuParent && menuParent.length > 0) {
        let resultMenuParent = [];

        for (let i = 0; i < menuParent.length; i++) {
          let menuAdmin = menuParent[i]; //1
          let menuObject = {};
          const [menuAdminItemL1, item1] = await connection.execute(
            `SELECT au.* FROM ADMIN_GROUP_MENU agm JOIN MENU_ADMIN au ON agm.MENU_ID = au.id WHERE au.MENU_LEVER = 2 AND agm.GROUP_ID = ? AND au.MENU_PARENT = ? ORDER BY au.MENU_ORDER`,
            [data.groupId, menuAdmin.id]
          );
          if (menuAdminItemL1 && menuAdminItemL1.length > 0) {
            let arrayMenuL1 = [];
            for (let i = 0; i < menuAdminItemL1.length; i++) {
              let menuItemL1 = menuAdminItemL1[i];
              let menuObject = {};
              const [menuAdminItemL2, item2] = await connection.execute(
                `SELECT * FROM MENU_ADMIN where MENU_PARENT=? AND MENU_LEVER = 3`,
                [menuItemL1.id]
              );
              if (menuAdminItemL2 && menuAdminItemL2.length > 0) {
                menuObject = { menuItemL1, menuAdminItemL2 };
                arrayMenuL1.push(menuObject);
              } else {
                menuObject = { menuItemL1 };
                arrayMenuL1.push(menuObject);
              }
            }

            menuObject = { ...menuAdmin, arrayMenuL1 };
            resultMenuParent.push(menuObject);
          } else {
            menuObject = { ...menuAdmin };
            resultMenuParent.push(menuObject);
          }
        }

        return {
          EM: "get all list menu admin success!",
          EC: 0,
          DT: resultMenuParent,
        };
      } else {
        return {
          EM: "get all list menu admin Null",
          EC: 1,
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

const handleReadMenuAdmin = async () => {
  try {
    const connection = await mysql.createConnection({
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      Promise: bluebird,
    });

    let query = `SELECT a.*, a_menu.Count AS "CountMenuItem" 
    FROM MENU_ADMIN a  LEFT OUTER JOIN (SELECT MENU_PARENT, COUNT(*) AS Count FROM MENU_ADMIN GROUP BY MENU_PARENT) a_menu ON a.id = a_menu.MENU_PARENT
    where a.MENU_PARENT = 0;`;
    const [menuParent, parent] = await connection.execute(query);

    if (menuParent && menuParent.length > 0) {
      let resultMenuParent = [];

      for (let i = 0; i < menuParent.length; i++) {
        let menuAdmin = menuParent[i]; //1
        let menuObject = {};
        const [menuAdminItemL1, item1] = await connection.execute(
          `SELECT * FROM MENU_ADMIN where MENU_PARENT=? AND MENU_LEVER = 2`,
          [menuAdmin.id]
        );
        if (menuAdminItemL1 && menuAdminItemL1.length > 0) {
          let arrayMenuL1 = [];
          for (let i = 0; i < menuAdminItemL1.length; i++) {
            let menuItemL1 = menuAdminItemL1[i];
            let menuObject = {};
            const [menuAdminItemL2, item2] = await connection.execute(
              `SELECT * FROM MENU_ADMIN where MENU_PARENT=? AND MENU_LEVER = 3`,
              [menuItemL1.id]
            );
            menuObject = { menuItemL1, menuAdminItemL2 };
            arrayMenuL1.push(menuObject);
          }

          menuObject = { menuAdmin, arrayMenuL1 };
          resultMenuParent.push(menuObject);
        } else {
          menuObject = { menuAdmin };
          resultMenuParent.push(menuObject);
        }
      }

      return {
        EM: "get all list menu admin success!",
        EC: 0,
        DT: resultMenuParent,
      };
    } else {
      return {
        EM: "get all list menu admin Null",
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

const handleRealAllMenuAdmin = async () => {
  try {
    const connection = await mysql.createConnection({
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      Promise: bluebird,
    });
    let query = `SELECT * FROM MENU_ADMIN WHERE  MENU_PARENT = 0 AND MENU_STATUS =1 ORDER BY MENU_ORDER`;
    const [menuParent, parent] = await connection.execute(query);

    if (menuParent && menuParent.length > 0) {
      let resultMenuParent = [];
      for (let i = 0; i < menuParent.length; i++) {
        let menuAdmin = menuParent[i];
        const [menuAdminItemL1, item1] = await connection.execute(
          `SELECT * FROM MENU_ADMIN WHERE MENU_LEVER = 2 AND MENU_PARENT = ? AND MENU_STATUS =1 ORDER BY MENU_ORDER`,
          [menuAdmin.id]
        );

        if (menuAdminItemL1 && menuAdminItemL1.length > 0) {
          resultMenuParent.push(menuAdmin);
          for (let i = 0; i < menuAdminItemL1.length; i++) {
            let menuItemL1 = menuAdminItemL1[i];
            const [menuAdminItemL2, item2] = await connection.execute(
              `SELECT * FROM MENU_ADMIN WHERE MENU_LEVER = 3 AND MENU_PARENT = ? AND MENU_STATUS =1 ORDER BY MENU_ORDER`,
              [menuItemL1.id]
            );
            if (menuAdminItemL2 && menuAdminItemL2.length > 0) {
              resultMenuParent.push(menuItemL1);
              for (let i = 0; i < menuAdminItemL2.length; i++) {
                resultMenuParent.push(menuAdminItemL2[i]);
              }
            } else {
              resultMenuParent.push(menuItemL1);
            }
          }
        } else {
          resultMenuParent.push(menuAdmin);
        }
      }
      return {
        EM: "get all list menu admin success!",
        EC: 0,
        DT: resultMenuParent,
      };
    } else {
      return {
        EM: "get all list menu admin Null",
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

// SELECT MENU_ADMIN.* FROM MENU_ADMIN WHERE  MENU_ADMIN.MENU_PARENT = 0 AND MENU_ADMIN.MENU_STATUS =1 ORDER BY MENU_ADMIN.MENU_ORDER

// const handleRealAllMenuAdmin = async () => {
//   try {
//     let listAllMenu = await db.MENU_ADMIN.findAll({
//       where: { MENU_STATUS: 1 },
//       attributes: ["id", "MENU_NAME_EN"],
//     });

//     if (listAllMenu) {
//       return {
//         EM: "get all list menu admin success!",
//         EC: 0,
//         DT: listAllMenu,
//       };
//     } else {
//       return {
//         EM: "get all list menu admin Null",
//         EC: 1,
//         DT: "",
//       };
//     }
//   } catch (e) {
//     console.log(e);
//     return {
//       EM: "something wrongs with services",
//       EC: 1,
//       DT: [],
//     };
//   }
// };

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

const handleGetListMenuByRole = async (id) => {
  try {
    if (!id) {
      return {
        EM: `Missing paramters groupId (Role)`,
        EC: 1,
        DT: "",
      };
    }

    const connection = await mysql.createConnection({
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE_NAME,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      Promise: bluebird,
    });

    let query = `SELECT au.* FROM ADMIN_GROUP_MENU agm JOIN MENU_ADMIN au ON agm.MENU_ID = au.id WHERE agm.GROUP_ID = ?`;
    const [menuRole, menuRoleItem] = await connection.execute(query, [id]);

    if (menuRole && menuRole.length > 0) {
      return {
        EM: `Get Menu By Role Succeeds`,
        EC: 0,
        DT: menuRole,
      };
    } else {
      return {
        EM: `Get Menu By Role Null or Fail`,
        EC: 0,
        DT: "",
      };
    }
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

const assignMenuToRole = async (data) => {
  try {
    console.log(data);
    if (!data) {
      return {
        EM: `Missing paramters data`,
        EC: 0,
        DT: "",
      };
    }

    let findMenuRole = await db.ADMIN_GROUP_MENU.findOne({
      where: { GROUP_ID: +data.selectedRole },
      raw: true,
    });

    if (findMenuRole) {
      await db.ADMIN_GROUP_MENU.destroy({
        where: { GROUP_ID: +data.selectedRole },
      });
    }
    await db.ADMIN_GROUP_MENU.bulkCreate(data.assignMenu);
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

const handleDeleteMenuAdmin = async (dataDelete) => {
  try {
    if (!dataDelete || !dataDelete.id) {
      return {
        EM: `Missing paramters data`,
        EC: 1,
        DT: "",
      };
    } else {
      //check menu con
      if (dataDelete && dataDelete.id) {
        await db.MENU_ADMIN.destroy({
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

const handleUpdateAdminItem = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let menuItem = await db.MENU_ADMIN.findOne({
        where: {
          id: data.key,
          // [Op.and]: [{ id: data.key }, { MENU_PARENT: data.MENU_PARENT }],
        },
      });

      if (menuItem) {
        await menuItem.update({
          MENU_NAME_EN: data.MENU_NAME_EN ? data.MENU_NAME_EN : "",
          MENU_NAME_VI: data.MENU_NAME_VI ? data.MENU_NAME_VI : "",
          MENU_ORDER: data.MENU_ORDER,
          MENU_STATUS: data.MENU_STATUS ? 1 : 0,
          MENU_BULLET: data.MENU_BULLET ? 1 : 0,
          MENU_CATEGORY: data.MENU_CATEGORY,
          MENU_ICON: data.MENU_ICON ? data.MENU_ICON : "",
          MENU_ICON_REACT: data.MENU_ICON_REACT ? data.MENU_ICON_REACT : "",
          MENU_LINK: data.MENU_LINK,
        });
        return {
          EM: "Update Menu Item success!",
          EC: 0,
          DT: "",
        };
      } else {
        return {
          EM: "Update Menu Item fail!",
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
  handleCreateMenuAdmin,
  handleReadPermission,
  getPermissionByRole,
  assignPermissionToRole,
  handleDeletePermission,
  handleUpdatePermission,
  handleReadMenuAdmin,
  handleDeleteMenuAdmin,
  handleCreateMenuAdminItem,
  handleUpdateAdminItem,
  handleRealAllMenuAdmin,
  handleGetListMenuByRole,
  assignMenuToRole,
  handleMenuDisplay,
};
