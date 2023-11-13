import db from "../models/index";
import emailService from "../service/emailService";
import mysql from "mysql2/promise";
import bluebird from "bluebird";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();
const { Op } = require("sequelize");

let buildUrlEmail = (userTest, token) => {
  let result = `${process.env.URL_REACT}/verify-test?token=${token}&userTest=${userTest}`;
  return result;
};

let getUserId = (userTest) => {
  if (userTest) {
    var idTest = [];
    for (let i = 0; i < userTest.length; i++) {
      for (let j = 0; j < userTest[i].length; j++) {
        idTest.push(userTest[i][j].id);
      }
    }
    return idTest;
  }
};

let getTypeSampleTest = (data) => {
  if (data) {
    var typeSampleTest = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].label) {
        typeSampleTest.push(data[i].label);
      }
    }
    return typeSampleTest;
  }
};

let getPeopleTest = (data) => {
  if (data) {
    var peopleTest = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].label) {
        peopleTest.push(data[i].label);
      }
    }
    return peopleTest;
  }
};

const handleSaveFileTest = async (data, files) => {
  try {
    return new Promise(async (resolve, reject) => {
      try {
        if (!files || !data) {
          resolve({
            EM: 1,
            EC: "Missing parameter!",
          });
        } else {
          let token = uuidv4();
          const connection = await mysql.createConnection({
            host: "172.29.2.91",
            user: "newstage",
            password: "newstage123#@!",
            database: "JWT_DB",
            Promise: bluebird,
          });

          let checUserTest = [];
          let userparam = JSON.parse(data.peopleTest);
          if (userparam && userparam.length > 0) {
            for (let i = 0; i < userparam.length; i++) {
              const [userTest, fields] = await connection.execute(
                `SELECT A.valueVi, U.email, U.id
                FROM ALLCODE AS A
                INNER JOIN USER AS U ON A.keyMap = U.roleId
                WHERE A.valueVi = ?
                `,
                [userparam[i].label]
              );

              if (userTest) {
                checUserTest.push(userTest);
              }
            }
          }

          let idUser = getUserId(checUserTest).toString();
          let typeSampleTestparam = getTypeSampleTest(
            JSON.parse(data.typeSampleTest)
          ).toString();
          let peopleTestparam = getPeopleTest(
            JSON.parse(data.peopleTest)
          ).toString();
          const requireTestReport = JSON.parse(data.peopleTest).length;

          if (data.typeTest && data.typeTest === "Nghiệm thu") {
            let require = await db.TEST.findOrCreate({
              where: { contractNo: data.contractNo },
              defaults: {
                userCreateId: data.userCreateId,
                userTestId: idUser,
                dateRegister: data.dateRegister,
                packageTest: data.packageTest,
                vendor: data.vendor,
                typeTest: data.typeTest,
                contractNo: data.contractNo,
                typeSampleTest: typeSampleTestparam,
                statusEmail: "0",
                statusTest: "0",
                localtion: data.localtion,
                timerTest: data.timerTest,
                contact: data.contact,
                peopleTest: peopleTestparam,
                description: token,
                numberTest: requireTestReport,
              },
              raw: true,
            });

            if (require[1] === false) {
              resolve({
                EM: "Đề nghị đã tồn tại vui lòng kiểm tra lại!",
                EC: 1,
                DT: {},
              });
            }
            if (require[1]) {
              for (let i = 0; i < files.length; i++) {
                await db.ATTACHFILE.create({
                  originalName: files[i].originalname,
                  destinationFile: files[i].destination,
                  filename: files[i].filename,
                  path: files[i].path,
                  status: 1,
                  attachFileId: require[0].dataValues.id,
                  fileTypeId: data.fileTypeId,
                });
              }
            }
          } else {
            let require = await db.TEST.findOrCreate({
              where: { packageTest: "nhap moi" },
              defaults: {
                userCreateId: data.userCreateId,
                userTestId: idUser,
                dateRegister: data.dateRegister,
                packageTest: data.packageTest,
                vendor: data.vendor,
                typeTest: data.typeTest,
                contractNo: data.contractNo,
                typeSampleTest: typeSampleTestparam,
                statusEmail: "0",
                statusTest: "0",
                localtion: data.localtion,
                timerTest: data.timerTest,
                contact: data.contact,
                peopleTest: peopleTestparam,
                description: token,
                numberTest: requireTestReport,
              },
              raw: true,
            });
            for (let i = 0; i < files.length; i++) {
              await db.ATTACHFILE.create({
                originalName: files[i].originalname,
                destinationFile: files[i].destination,
                filename: files[i].filename,
                path: files[i].path,
                status: 1,
                attachFileId: require[0].dataValues.id,
                fileTypeId: data.fileTypeId,
              });
            }
          }

          let urlTest = buildUrlEmail(idUser, token);
          //chưa kiểm tra lại điều kiện cần để gửi mail
          await emailService.sendSimpleEmail(
            data,
            checUserTest,
            urlTest,
            files[0].path,
            files[0].filename,
            peopleTestparam
          );

          resolve({
            EM: "Create New Info File Test success!",
            EC: 0,
            DT: {},
          });
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  } catch (e) {
    console.log(e);
    return {
      EM: "error from service",
      EC: 1,
      DT: "",
    };
  }
};

const handleSaveFileAttachment = async (data, files) => {
  try {
    return new Promise(async (resolve, reject) => {
      try {
        if (!files || !data) {
          resolve({
            EM: 1,
            EC: "Missing parameter!",
          });
        } else {
          if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
              await db.ATTACHFILE.create({
                originalName: files[i].originalname,
                destinationFile: files[i].destination,
                filename: files[i].filename,
                path: files[i].path,
                status: "1",
                attachFileId: data.requireId,
                fileTypeId: data.fileTypeId,
                description: data.userCreateId,
                localtion: data.description
              });
            }
            resolve({
              EM: "Create a new Attachfile success!",
              EC: 0,
              DT: {},
            });
          } else {
            resolve({
              EM: "AttachFile is null!",
              EC: 1,
              DT: {},
            });
          }
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  } catch (e) {
    console.log(e);
    return {
      EM: "error from service",
      EC: 1,
      DT: "",
    };
  }
};

const handleSaveFileReport = async (data, files) => {
  try {
    return new Promise(async (resolve, reject) => {
      try {
        if (!data) {
          resolve({
            EM: 1,
            EC: "Missing parameter!",
          });
        } else {
          if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
              await db.ATTACHFILE.create({
                originalName: files[i].originalname,
                destinationFile: files[i].destination,
                filename: files[i].filename,
                path: files[i].path,
                status: "1",
                attachFileId: data.requireId,
                fileTypeId: data.fileTypeId,
                description: data.userCreateId,
                localtion: data.description
              });
            }

            let checkFileTest = await db.TEST.findOne({
              where: { id: data.requireId },
              attributes: ["numberTest"],
              raw: true,
            });

            const connection = await mysql.createConnection({
              host: "172.29.2.91",
              user: "newstage",
              password: "newstage123#@!",
              database: "JWT_DB",
              Promise: bluebird,
            });
            const [countFile, fields] = await connection.execute(
              `SELECT count(id) AS 'COUNT'
              FROM ATTACHFILE A
              WHERE A.attachFileId = ? AND A.fileTypeId = "Báo cáo kỹ thuật";
              `,
              [data.requireId]
            );

            if (checkFileTest && checkFileTest.numberTest && countFile) {
              if (+checkFileTest.numberTest === countFile[0].COUNT) {
                await db.TEST.update(
                  { statusTest: 1 },
                  { where: { id: data.requireId } }
                );
              }
            }

            resolve({
              EM: "Create a new Attachfile report success!",
              EC: 0,
              DT: {},
            });
          } else {
            // resolve({
            //   EM: "AttachFile Report is null!",
            //   EC: 1,
            //   DT: {},
            // });

            await db.ATTACHFILE.create({
              originalName: "",
              destinationFile: "",
              filename: "",
              path: "",
              status: "1",
              attachFileId: data.requireId,
              fileTypeId: data.fileTypeId,
              description: data.userCreateId,
              localtion: data.description
            });


            let checkFileTest = await db.TEST.findOne({
              where: { id: data.requireId },
              attributes: ["numberTest"],
              raw: true,
            });

            const connection = await mysql.createConnection({
              host: "172.29.2.91",
              user: "newstage",
              password: "newstage123#@!",
              database: "JWT_DB",
              Promise: bluebird,
            });
            const [countFile, fields] = await connection.execute(
              `SELECT count(id) AS 'COUNT'
              FROM ATTACHFILE A
              WHERE A.attachFileId = ? AND A.fileTypeId = "Báo cáo kỹ thuật";
              `,
              [data.requireId]
            );

            if (checkFileTest && checkFileTest.numberTest && countFile) {
              if (+checkFileTest.numberTest === countFile[0].COUNT) {
                await db.TEST.update(
                  { statusTest: 1 },
                  { where: { id: data.requireId } }
                );
              }
            }

            resolve({
              EM: "Create a new Attachfile report success!",
              EC: 0,
              DT: {},
            });
          }
        }
      } catch (e) {
        console.log(e);
        reject(e);
      }
    });
  } catch (e) {
    console.log(e);
    return {
      EM: "error from service",
      EC: 1,
      DT: "",
    };
  }
};

let getFilesWithPagination = async (page, limit, user) => {
  try {
    let offset = (page - 1) * limit;

    // const { count, rows } = await db.TEST.findAndCountAll({
    //   offset: offset,
    //   limit: limit,
    //   attributes: [
    //     "id",
    //     "packageTest",
    //     "vendor",
    //     "typeTest",
    //     "contractNo",
    //     "typeSampleTest",
    //     "localtion",
    //     "timerTest",
    //     "contact",
    //     "peopleTest",
    //     "dateRegister",
    //     "statusEmail",
    //     "statusTest",
    //     "numberTest",
    //   ],
    //   include: [
    //     {
    //       model: db.ATTACHFILE,
    //       attributes: [
    //         "originalName",
    //         "destinationFile",
    //         "filename",
    //         "path",
    //         "status",
    //       ],
    //     },
    //     { model: db.USER, attributes: ["email"] },
    //   ],

    //   order: [["id", "DESC"]],
    // });

    if (user === "1" || user === "2" || user === "3" || user === "18" || user === "27") {
      const { count, rows } = await db.TEST.findAndCountAll({
        offset: offset,
        limit: limit,
        attributes: [
          "id",
          "packageTest",
          "vendor",
          "typeTest",
          "contractNo",
          "typeSampleTest",
          "localtion",
          "timerTest",
          "contact",
          "peopleTest",
          "dateRegister",
          "statusEmail",
          "statusTest",
          "numberTest",
        ],
        include: [{ model: db.USER, attributes: ["email"] }],
        order: [["id", "DESC"]],
      });

      let totalPages = Math.ceil(count / limit);
      let data = {
        totalRows: count,
        totalPages: totalPages,
        files: rows,
      };
      return {
        EM: "Load File pagination success",
        EC: 0,
        DT: data,
      };
    } else {
      const { count, rows } = await db.TEST.findAndCountAll({
        offset: offset,
        limit: limit,
        attributes: [
          "id",
          "packageTest",
          "vendor",
          "typeTest",
          "contractNo",
          "typeSampleTest",
          "localtion",
          "timerTest",
          "contact",
          "peopleTest",
          "dateRegister",
          "statusEmail",
          "statusTest",
          "numberTest",
        ],
        include: [{ model: db.USER, attributes: ["email"] }],
        where: {
          userTestId: {
            [Op.like]: `%${user}%`,
          },
        },

        order: [["id", "DESC"]],
      });
      let totalPages = Math.ceil(count / limit);
      let data = {
        totalRows: count,
        totalPages: totalPages,
        files: rows,
      };
      return {
        EM: "Load File pagination success",
        EC: 0,
        DT: data,
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

let getProfileTest = async (id) => {
  try {
    if (!id) {
      return {
        EC: 1,
        EM: "Missing parameter!",
        DT: "",
      };
    } else {
      let data = await db.ATTACHFILE.findAll({
        where: { attachFileId: id },
        raw: true,
      });
      return {
        EM: "Get profile success",
        EC: 0,
        DT: data,
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

let getDetailTest = async (id) => {
  try {
    if (!id) {
      return {
        EM: 1,
        EC: "Missing parameter!",
        DT: "",
      };
    } else {
      let data = await db.TEST.findOne({
        where: { id: id },
        raw: true,
      });
      return {
        EM: "Get detail Test success",
        EC: 0,
        DT: [data],
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

const deleteRegisterTest = async (data) => {
  try {
    let registerTest = await db.TEST.findOne({
      where: { id: data.id },
    });
    if (registerTest) {
      let require = await db.TEST_LOG_DELETE.findOrCreate({
        where: { contractNo: "nhập log xoá" },
        defaults: {
          idTest: registerTest.id,
          userCreateId: registerTest.userCreateId,
          dateRegister: registerTest.dateRegister,
          packageTest: registerTest.packageTest,
          vendor: registerTest.vendor,
          typeTest: registerTest.typeTest,
          contractNo: registerTest.contractNo,
          typeSampleTest: registerTest.typeSampleTest,
          statusEmail: "0",
          localtion: registerTest.localtion,
          timerTest: registerTest.timerTest,
          contact: registerTest.contact,
          peopleTest: registerTest.peopleTest,
        },
        raw: true,
      });
      if (require[1] === false) {
        return {
          EM: "Đề nghị cần xoá đã tồn tại vui lòng kiểm tra lại!",
          EC: 1,
          DT: {},
        };
      }
      await registerTest.destroy();
      return {
        EM: "Delete Register Test succeeds",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Register Test not exist",
        EC: 2,
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

// || !data.userVerify
const postVerifyTest = async (data) => {
  try {
    if (!data.token) {
      return {
        EC: 1,
        EM: "Missing parameter!",
        DT: "",
      };
    } else {
      let infor = await db.TEST.findOne({
        where: {
          description: data.token,
        },
        raw: true,
      });

      if (infor) {
        if (infor.statusEmail === "0") {
          return {
            EM: "Đơn vị test đề nghị này chưa kiểm tra và xác nhận!",
            EC: 0,
            DT: "",
          };
        }
        if (infor.statusEmail === "1") {
          return {
            EM: "Đề nghị Test đã được xác nhận và trong quá trình tiến hành kiểm tra!",
            EC: 0,
            DT: "",
          };
        }
      } else {
        return {
          EM: "Test is not exit",
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

const postVerifyUserTest = async (data) => {
  try {
    if (!data.token || !data.userTest) {
      return {
        EC: 1,
        EM: "Missing parameter!",
        DT: "",
      };
    } else {
      let infor = await db.TEST.findOne({
        where: {
          description: data.token,
          userTestId: data.userTest,
        },
      });

      if (infor) {
        if (infor.statusEmail === "0") {
          infor.statusEmail = "1";
          await infor.save();

          return {
            EM: "Xác nhận Test đề nghị thành công!",
            EC: 0,
            DT: "",
          };
        }
        if (infor.statusEmail === "1") {
          return {
            EM: "Đề nghị test này đã được xác nhận kiểm tra thành công",
            EC: 0,
            DT: "",
          };
        }
      } else {
        return {
          EM: "Test is not exit or has been confirm",
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

let getDepartmentTest = async () => {
  try {
    let data = await db.ALLCODE.findAll({
      where: { type: "ROLE" },
      attributes: ["keyMap", "type", "valueVi"],
      raw: true,
    });
    return {
      EM: "Get department Test success",
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

module.exports = {
  handleSaveFileTest,
  getFilesWithPagination,
  getProfileTest,
  getDetailTest,
  deleteRegisterTest,
  postVerifyUserTest,
  postVerifyTest,
  handleSaveFileAttachment,
  getDepartmentTest,
  handleSaveFileReport,
};
