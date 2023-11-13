import db from "../models/index";
require("dotenv").config();
const fs = require("fs");

const handleCreateSideBar = async (data, file) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let linkIcon = process.env.LINK_AVATAR;
      if (file) {
        await db.CONTENT_SIDEBAR.create({
          NAME_VI: data.nameVi,
          NAME_EN: data.nameEn,
          CONTENT_ICON_LINK: `${linkIcon}/${file.filename}`,
          CONTENT_ICON_PATH: `${file.destination}/${file.filename}`,
          CONTENT_ICON_IMG: data.content_icon_img,
          SORT_ORDER: +data.sort_order,
          URL_SIDERBAR: data.url_sidebar,
          STATUS: 1,
          NOTE: data.note,
        });
      } else {
        await db.CONTENT_SIDEBAR.create({
          NAME_VI: data.nameVi,
          NAME_EN: data.nameEn,
          CONTENT_ICON_IMG: data.content_icon_img,
          SORT_ORDER: data.sort_order,
          URL_SIDERBAR: data.url_sidebar,
          STATUS: 1,
          NOTE: data.note,
        });
      }

      return {
        EM: "Create new a sidebar success!",
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

const handleDeleteSideBar = async (id) => {
  try {
    let content_sidebar = await db.CONTENT_SIDEBAR.findOne({
      where: { id: id },
    });
    if (content_sidebar) {
      if (content_sidebar.dataValues.CONTENT_ICON_PATH) {
        let ICON = content_sidebar.dataValues.CONTENT_ICON_PATH;

        if (fs.existsSync(ICON)) {
          fs.unlink(ICON, (err) => {
            if (err) throw err; //handle your error the way you want to;
            console.log("File was deleted: ", ICON); //or else the file will be deleted
          });
        } else {
          console.log("File is not found: ", ICON);
        }
      }

      await content_sidebar.destroy();
      return {
        EM: "Delete content_sidebar success!",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "Content_sidebar not exist!",
        EC: 1,
        DT: "",
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

const getAllSideBar = async () => {
  try {
    let sibars = await db.CONTENT_SIDEBAR.findAll({
      attributes: [
        "id",
        "NAME_VI",
        "NAME_EN",
        "CONTENT_ICON_LINK",
        "CONTENT_ICON_IMG",
        "SORT_ORDER",
        "URL_SIDEBAR",
        "STATUS",
        "NOTE",
      ],
      order: [["SORT_ORDER", "ASC"]],
    });
    if (sibars) {
      return {
        EM: "get all sidebar success!",
        EC: 0,
        DT: sibars,
      };
    } else {
      return {
        EM: "get all sidebar Fail",
        EC: 1,
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

const getSideBarWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    const { count, rows } = await db.CONTENT_SIDEBAR.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: [
        "id",
        "NAME_VI",
        "NAME_EN",
        "CONTENT_ICON_LINK",
        "CONTENT_ICON_IMG",
        "SORT_ORDER",
        "URL_SIDEBAR",
        "STATUS",
        "NOTE",
      ],

      order: [["id", "DESC"]],
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPages: totalPages,
      sideBars: rows,
    };
    return {
      EM: "pagination sidebar success",
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

const handleUpdateSideBar = async (data, file) => {
  try {
    if (!data) {
      return {
        EM: "missing paramesters!",
        EC: 1,
        DT: "",
      };
    } else {
      let sidebar = await db.CONTENT_SIDEBAR.findOne({
        where: { id: data.sidebarId },
      });
      let linkIcon = process.env.AVATAR;
      if (sidebar) {
        if (file) {
          let ICON = sidebar.dataValues.CONTENT_ICON_PATH;

          if (fs.existsSync(ICON)) {
            fs.unlink(ICON, (err) => {
              if (err) throw err; //handle your error the way you want to;
              console.log("File was deleted: ", ICON); //or else the file will be deleted
            });
          } else {
            console.log("File is not found: ", ICON);
          }

          await sidebar.update({
            NAME_VI: data.nameVi ? data.NameVi : sidebar.NAME_VI,
            NAME_EN: data.nameEn ? data.nameEn : sidebar.NAME_EN,
            SORT_ORDER: +data.sort_order
              ? +data.sort_order
              : sidebar.SORT_ORDER,
            URL_SIDEBAR: data.url_sidebar
              ? data.url_sidebar
              : sidebar.URL_SIDERBAR,
            STATUS: data.status ? 1 : 0,
            NOTE: data.note ? data.note : sidebar.NOTE,
            CONTENT_ICON_LINK: `${linkIcon}/${file.filename}`,
            CONTENT_ICON_PATH: `${file.destination}/${file.filename}`,
            CONTENT_ICON_IMG: data.content_icon_img,
          });
        } else {
          await sidebar.update({
            NAME_VI: data.nameVi ? data.nameVi : sidebar.NAME_VI,
            NAME_EN: data.nameEn ? data.nameEn : sidebar.NAME_EN,
            SORT_ORDER: +data.sort_order
              ? +data.sort_order
              : sidebar.SORT_ORDER,
            URL_SIDEBAR: data.url_sidebar
              ? data.url_sidebar
              : sidebar.URL_SIDERBAR,
            STATUS: data.status ? 1 : 0,
            NOTE: data.note ? data.note : sidebar.NOTE,
            CONTENT_ICON_IMG: data.content_icon_img,
          });
        }

        return {
          EM: "Update Sidebar success!",
          EC: 0,
          DT: "",
        };
      } else {
        if (file) {
          let AVATAR = file ? `${file.destination}/${file.filename}` : "";

          if (fs.existsSync(AVATAR)) {
            fs.unlink(AVATAR, (err) => {
              if (err) throw err; //handle your error the way you want to;
              console.log("File was deleted: ", AVATAR); //or else the file will be deleted
            });
          } else {
            console.log("File is not found: ", AVATAR);
          }
        }
        return {
          EM: "Sidebar not found!",
          EC: 1,
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
  handleCreateSideBar,
  handleDeleteSideBar,
  getAllSideBar,
  getSideBarWithPagination,
  handleUpdateSideBar,
};
