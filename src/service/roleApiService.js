import db from "../models/index";

const getRoleByGroup = async (id) => {
  try {
    if (!id) {
      return {
        EM: `Missing paramters groupId`,
        EC: 1,
        DT: [],
      };
    }
    let roles = await db.GROUP.findOne({
      where: { id: id },
      attributes: ["id", "NAME_VI", "NAME_EN", "DESCRIPTION"],

      include: [
        {
          model: db.ROLE_PERMISSION,
          attributes: ["id", "URL", "DESCRIPTION"],
          through: { attributes: [] },
        },
      ],
    });

    return {
      EM: `Get Role By Group Succeeds`,
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

const assignRoleToGroup = async (data) => {
  try {
    if (!data) {
      return {
        EM: `Missing paramters data`,
        EC: 0,
        DT: [],
      };
    }

    let findGroupRole = await db.GROUP_ROLE.findOne({
      where: { GROUP_ID: +data.selectGroup },
      raw: true,
    });

    if (findGroupRole) {
      await db.GROUP_ROLE.destroy({
        where: { GROUP_ID: +data.selectGroup },
      });
    }
    await db.GROUP_ROLE.bulkCreate(data.groupRoles);
    return {
      EM: `Assign Group-Role success!`,
      EC: 0,
      DT: [],
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

const getRoleByUser = async (id) => {
  try {
    if (!id) {
      return {
        EM: `Missing paramters UserId`,
        EC: 1,
        DT: [],
      };
    }
    let roles = await db.USER.findOne({
      where: { id: id },
      attributes: ["id", "EMAIL", "USER_FIRSTNAME", "USER_PHONE"],

      include: [
        {
          model: db.ROLE_PERMISSION,
          attributes: ["id", "URL", "DESCRIPTION"],
          through: { attributes: [] },
        },
      ],
    });

    if (roles) {
      return {
        EM: `Get Role By User Succeeds`,
        EC: 0,
        DT: roles,
      };
    } else {
      return {
        EM: `Not found User!`,
        EC: 1,
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

const assignRoleToUser = async (data) => {
  try {
    if (!data) {
      return {
        EM: `Missing paramters data`,
        EC: 0,
        DT: [],
      };
    }

    let findUserRole = await db.USER_ROLE.findOne({
      where: { USER_ID: +data.selectUser },
      raw: true,
    });

    if (findUserRole) {
      await db.USER_ROLE.destroy({
        where: { USER_ID: +data.selectUser },
      });
    }
    await db.USER_ROLE.bulkCreate(data.userRoles);
    return {
      EM: `Assign User-Role success!`,
      EC: 0,
      DT: [],
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

const handleCreateRole = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: [],
      };
    } else {
      //handle create a new user with avartar

      await db.ROLE_PERMISSION.create({
        URL: data.url,
        DESCRIPTION: data.description,
      });
      return {
        EM: "Create New A Role success!",
        EC: 0,
        DT: [],
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

const handleDeleteRole = async (id) => {
  try {
    let role = await db.ROLE_PERMISSION.findOne({
      where: { id: id },
    });
    if (role) {
      await role.destroy();

      let findRoleUser = await db.USER_ROLE.findOne({
        where: { ROLE_ID: id },
        raw: true,
      });

      if (findRoleUser) {
        await db.USER_ROLE.destroy({
          where: { ROLE_ID: id },
        });
      }

      let findRoleGroup = await db.GROUP_ROLE.findOne({
        where: { ROLE_ID: id },
        raw: true,
      });

      if (findRoleGroup) {
        await db.GROUP_ROLE.destroy({
          where: { ROLE_ID: id },
        });
      }

      return {
        EM: "Delete role success!",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Role not exist!",
        EC: 1,
        DT: [],
      };
    }
  } catch (e) {
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};

const getAllRole = async () => {
  try {
    let groups = await db.ROLE_PERMISSION.findAll({
      attributes: ["id", "URL", "DESCRIPTION"],

      order: [["id", "DESC"]],
    });
    if (groups) {
      return {
        EM: "get All Role Success!",
        EC: 0,
        DT: groups,
      };
    } else {
      return {
        EM: "get All Role Fail",
        EC: 1,
        DT: [],
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

const getRoleWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.ROLE_PERMISSION.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: ["id", "URL", "DESCRIPTION"],

      order: [["id", "DESC"]],
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPages: totalPages,
      roles: rows,
    };
    return {
      EM: "pagination role success",
      EC: 0,
      DT: data,
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: [],
    };
  }
};

const handleBulkRole = async (roles) => {
  try {
    let currentRoles = await db.ROLE_PERMISSION.findAll({
      attributes: ["URL", "DESCRIPTION"],
      raw: true,
    });
    const persists = roles.filter(
      ({ URL: URL1 }) => !currentRoles.some(({ URL: URL2 }) => URL1 === URL2)
    );

    if (persists.length === 0) {
      return {
        EM: "Nothing Role to create....",
        EC: 0,
        DT: [],
      };
    }

    await db.ROLE_PERMISSION.bulkCreate(persists);
    return {
      EM: `Create New succeeds ${persists.length} Role....`,
      EC: 0,
      DT: [],
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

const handleUpdateRole = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: [],
      };
    } else {
      let role = await db.ROLE_PERMISSION.findOne({
        where: { id: data.roleId },
      });

      if (role) {
        await role.update({
          URL: data.url ? data.url : role.URL,
          DESCRIPTION: data.description ? data.description : role.DESCRIPTION,
        });
        return {
          EM: "Update role success!",
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
      DT: [],
    };
  }
};

module.exports = {
  getRoleByGroup,
  assignRoleToGroup,
  handleCreateRole,
  handleDeleteRole,
  getAllRole,
  getRoleWithPagination,
  handleBulkRole,
  getRoleByUser,
  assignRoleToUser,
  handleUpdateRole,
};
