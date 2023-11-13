import db from "../models/index";

const handleCreateGroup = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      //handle create a new user with avartar

      await db.GROUP.create({
        NAME_VI: data.nameVi,
        NAME_EN: data.nameEn,
        DESCRIPTION: data.description,
      });
      return {
        EM: "Create New A Group success!",
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

const handleDeleteGroup = async (id) => {
  try {
    let group = await db.GROUP.findOne({
      where: { id: id },
    });
    if (group) {
      await group.destroy();

      let findGroupRole = await db.GROUP_ROLE.findOne({
        where: { GROUP_ID: id },
        raw: true,
      });

      if (findGroupRole) {
        await db.GROUP_ROLE.destroy({
          where: { GROUP_ID: id },
        });
      }

      return {
        EM: "Delete group success!",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Group not exist!",
        EC: 1,
        DT: "",
      };
    }
  } catch (e) {
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: "",
    };
  }
};

const getAllGroup = async () => {
  try {
    let groups = await db.GROUP.findAll({
      attributes: [
        "id",
        "NAME_VI",
        "NAME_EN",
        "DESCRIPTION",
        "createdAt",
        "updatedAt",
      ],

      order: [["id", "DESC"]],
    });
    if (groups) {
      return {
        EM: "get All Group Success!",
        EC: 0,
        DT: groups,
      };
    } else {
      return {
        EM: "get All Group Fail",
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

const getGroupWithPagination = async (current, pageSize) => {
  try {
    let offset = (current - 1) * pageSize;
    const { count, rows } = await db.GROUP.findAndCountAll({
      offset: offset,
      limit: pageSize,
      attributes: [
        "id",
        "NAME_VI",
        "NAME_EN",
        "DESCRIPTION",
        "createdAt",
        "updatedAt",
      ],

      order: [["id", "DESC"]],
    });
    let totalPages = Math.ceil(count / pageSize);
    let data = {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: count,
      },
      roles: rows,
    };
    return {
      EM: "pagination group success",
      EC: 0,
      DT: data,
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: "",
    };
  }
};

const handleBulkGroup = async (groups) => {
  try {
    let currentGroup = await db.GROUP.findAll({
      attributes: ["NAME_VI", "NAME_EN", "DESCRIPTION"],
      raw: true,
    });
    const persists = groups.filter(
      ({ NAME_EN: NAME_EN1 }) =>
        !currentGroup.some(({ NAME_EN: NAME_EN2 }) => NAME_EN1 === NAME_EN2)
    );

    if (persists.length === 0) {
      return {
        EM: "Nothing Group to create....",
        EC: 0,
        DT: "",
      };
    }

    await db.GROUP.bulkCreate(persists);
    return {
      EM: `Create New succeeds ${persists.length} Group....`,
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "something wrongs with services",
      EC: 1,
      DT: "",
    };
  }
};

const handleUpdateGroup = async (data) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let group = await db.GROUP.findOne({
        where: { id: data.groupId },
      });

      if (group) {
        await group.update({
          NAME_VI: data.nameVi ? data.nameVi : group.NAME_VI,
          NAME_EN: data.nameEn ? data.nameEn : group.NAME_EN,
          DESCRIPTION: data.description ? data.description : group.DESCRIPTION,
        });
        return {
          EM: "Update group success!",
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
  handleCreateGroup,
  handleDeleteGroup,
  getAllGroup,
  getGroupWithPagination,
  handleBulkGroup,
  handleUpdateGroup,
};
