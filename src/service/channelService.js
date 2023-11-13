const db = require("../models");
const { Op } = require("sequelize");
import mysql from "mysql2/promise";
import bluebird from "bluebird";
import moment from "moment";

import axiosRaspberry from "../setup/axiosRaspberry";
import {
  getChannelCurrentMonitor,
  setChannelMonitorDibsys,
} from "../services/channelService";

const XLSX = require("xlsx");

let getAreaMonitorT2 = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.AREA_MONITOR.findAll({
        attributes: ["id", "headendName", "description"],
        raw: true,
        nest: true,
      });
      resolve({
        EM: "Get area moniter dvb-t2 success!",
        EC: 0,
        DT: data,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAreaMonitor = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          EM: "Missing parameter!",
          EC: 1,
          DT: [],
        });
      } else {
        let data = await db.USER_AREA.findAll({
          where: { userId: id },
          attributes: ["userId", "areaId"],
          include: [
            {
              model: db.AREA_MONITOR,
              as: "dataArea",
              attributes: [
                "rasperryName",
                "rasperryHost",
                "urlRasperry",
                "headendName",
                "storeId",
                "address",
                "contact",
                "description",
              ],
            },
          ],
          raw: true,
          nest: true,
        });
        resolve({
          EM: "Get area moniter array success!",
          EC: 0,
          DT: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getDeviceRaspbery = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          EM: "Missing parameter!",
          EC: 1,
          DT: [],
        });
      } else {
        let data = await db.DEVICE.findAll({
          // where: { areaId: id },
          where: {
            [Op.and]: [{ areaId: +id }, { vendorId: 4 }],
          },
          attributes: [
            "deviceName",
            "ipAddress",
            "description",
            "processing_number",
          ],
          raw: true,
          nest: true,
        });
        if (data[0]) {
          resolve({
            EM: "Get information Raspberry success!",
            EC: 0,
            DT: data,
          });
        } else {
          resolve({
            EM: "Get information Raspberry null!",
            EC: 1,
            DT: [],
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let actionChannels = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data) {
        resolve({
          EM: "Missing parameter!",
          EC: 1,
          DT: [],
        });
      } else {
        let isShow = true;
        let actionChannel = await setChannelMonitorDibsys(data, isShow);
        console.log("check data from Mr Loc: ", actionChannel);
        if (actionChannel) {
          resolve({
            EM: actionChannel.error_message,
            EC: actionChannel.error_code,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getChannels = (urlRaspberry) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!urlRaspberry) {
        resolve({
          EM: "Missing parameter!",
          EC: 1,
          DT: [],
        });
      } else {
        let getStatusChannel = await getChannelCurrentMonitor(urlRaspberry);
        console.log("check data from Mr Loc: ", getStatusChannel);
        if (getStatusChannel && getStatusChannel.error_code === 0) {
          // setArrChannelMonitor(getStatusChannel.channels)
          resolve({
            EM: getStatusChannel.error_message,
            EC: getStatusChannel.error_code,
            monitoring_channel_count: getStatusChannel.monitoring_channel_count,
            channels: getStatusChannel.channels,
          });
        } else {
          resolve({
            EM: getStatusChannel.error_message,
            EC: getStatusChannel.error_code,
            monitoring_channel_count: getStatusChannel.monitoring_channel_count,
            channels: getStatusChannel.channels,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getChanelandCount = (page, limit, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await mysql.createConnection({
        host: "172.29.2.91",
        user: "newstage",
        password: "newstage123#@!",
        database: "JWT_DB",
        Promise: bluebird,
      });
      let offset = (page - 1) * limit;
      let result = {};
      // const [channel, fields] = await connection.execute(
      //   `SELECT D.zabbix_hostId, D.ipAddress, D.vendorId, CD.lcnChannel, CD.channelStatus, CD.channelStatusPlay, CD.channelPidLast, CD.zabbixItemOid, CD.description AS "descriptionDevice", CD.frequency, C.channelName, C.channelPort, C.channelIP, C.channelType, C.channelStatus AS "channelStatusMonitor", C.channelImage
      //   FROM DEVICE AS D
      //   JOIN CHANNEL_DEVICE AS CD ON D.id = CD.deviceId
      //   JOIN CHANNEL AS C ON CD.channelId = C.id
      //   WHERE D.areaId = ?
      //   ORDER BY CD.lcnChannel
      //   LIMIT ?
      //   OFFSET ?`,
      //   [id, limit, offset]
      // );

      const [channel, fields] = await connection.execute(
        `SELECT D.ipAddress, D.description, D.vendorId, CD.lcnChannel, CD.zabbixItemOid, CD.frequency, C.channelName, C.channelPort, C.channelIP, C.channelType, C.channelDescription, C.channelImage, C.axingChannelName, C.gospellChannelName
        FROM DEVICE AS D 
        JOIN CHANNEL_DEVICE AS CD ON D.id = CD.deviceId 
        JOIN CHANNEL AS C ON CD.channelId = C.id
        WHERE D.areaId = ?
        ORDER BY CD.lcnChannel
        LIMIT ?
        OFFSET ?`,
        [id, limit, offset]
      );

      result = { ...result, channel };

      const [count, item] = await connection.execute(
        `SELECT COUNT(D.id) AS "count"
        FROM DEVICE AS D 
        JOIN CHANNEL_DEVICE AS CD ON D.id = CD.deviceId 
        JOIN CHANNEL AS C ON CD.channelId = C.id
        WHERE D.areaId = ?
        ORDER BY CD.lcnChannel`,
        [id]
      );
      result = { ...result, count };
      resolve(result);
    } catch (error) {
      // console.log(">>> check error: ", error);
      reject(error);
    }
  });
};

let getAllChannel = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await mysql.createConnection({
        host: "172.29.2.91",
        user: "newstage",
        password: "newstage123#@!",
        database: "JWT_DB",
        Promise: bluebird,
      });

      const [channel, fields] = await connection.execute(
        `SELECT D.ipAddress, D.description, D.vendorId, C.id AS "channelId", C.axingChannelName, C.gospellChannelName, C.channelType, C.channelDescription, C.channelIP, C.channelImage, C.channelPort, CD.deviceId, CD.frequency, CD.lcnChannel
      FROM DEVICE AS D 
      JOIN CHANNEL_DEVICE AS CD ON D.id = CD.deviceId 
      JOIN CHANNEL AS C ON CD.channelId = C.id
      WHERE D.areaId = ?
      ORDER BY CD.lcnChannel
      `,
        [+id]
      );

      //check Channel Axing
      // const [channel, fields] = await connection.execute(
      // `SELECT C.*
      // FROM DEVICE AS D
      // JOIN CHANNEL_DEVICE AS CD ON D.id = CD.deviceId
      // JOIN CHANNEL AS C ON CD.channelId = C.id
      // WHERE D.areaId = ?
      // ORDER BY CD.lcnChannel
      // `,
      //   [+id]
      // );

      // const [channel, fields] = await connection.execute(
      //   `SELECT DISTINCT C.id
      //   FROM CHANNEL_DEVICE CD
      //   INNER JOIN CHANNEL C ON CD.channelId = C.id
      //   `
      // );

      // console.log("check channel device: ", channel.length)

      // const [channelAll, fieldsAll] = await connection.execute(
      //   `SELECT C.id
      //   FROM CHANNEL C
      //   `
      // );

      // console.log("check channel: ", channelAll.length)

      // let result = []
      // for (let i = 0; i < channelAll.length; i++) {
      //   // if (i === 0) {
      //   //   // if (channel.includes(channelAll[i])) {
      //   //   //   console.log("check include: ", channel.includes(channelAll[i]))
      //   //   //   console.log("check: ", channelAll[i])
      //   //   //   result.push(channelAll[i]);
      //   //   // } else {
      //   //   //   console.log("check include else: ", channel.includes(channelAll[i]))
      //   //   //   console.log("check channel: ", channelAll[i])
      //   //   //   console.log("check channel device: ", channel)

      //   //   // }

      //   // }
      //   let find = false
      //   for (let j = 0; j < channel.length; j++) {
      //     if (JSON.stringify(channelAll[i]) === JSON.stringify(channel[j])) {
      //       // console.log("check channel: ", channelAll[i])
      //       // console.log("true")
      //       find = true
      //       break
      //     }
      //     // else {
      //     //   console.log("check channel: ", JSON.stringify(channelAll[0]))
      //     //   console.log("check channel device *************: ", JSON.stringify(channel[j]))
      //     //   console.log("false")
      //     // }
      //   }

      //   if (find === false) {
      //     result.push(channelAll[i])
      //     console.log("check channel device not found *************: ", channelAll[i])
      //   }
      // }

      resolve(channel);
      // resolve(result);
    } catch (error) {
      // console.log(">>> check error: ", error);
      reject(error);
    }
  });
};

let getChannelMonitor = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          EM: "Missing parameter!",
          EC: 1,
          DT: [],
        });
      } else {
        let channel = await getAllChannel(id);

        resolve({
          EM: "Get channel moniter all success!",
          EC: 0,
          DT: channel,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getChannelMonitorWithPagination = (page, limit, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id || !page || !limit) {
        resolve({
          EM: "Missing parameter!",
          EC: 1,
          DT: [],
        });
      } else {
        let { channel, count } = await getChanelandCount(page, limit, id);
        let totalPages = Math.ceil(count[0].count / limit);
        let data = {
          totalRows: count[0].count,
          totalPages: totalPages,
          data: channel,
        };

        resolve({
          EM: "Get channel moniter pagination success!",
          EC: 0,
          DT: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

//lấy bảng kênh cho phòng kinh doanh
let getAllChannelBusiness = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await mysql.createConnection({
        host: "172.29.2.91",
        user: "newstage",
        password: "newstage123#@!",
        database: "JWT_DB",
        Promise: bluebird,
      });

      const [channel, fields] = await connection.execute(
        `SELECT D.vendorId, C.axingChannelName, C.gospellChannelName, C.channelType, CD.lcnChannel
      FROM DEVICE AS D 
      JOIN CHANNEL_DEVICE AS CD ON D.id = CD.deviceId 
      JOIN CHANNEL AS C ON CD.channelId = C.id
      WHERE D.areaId = ?
      ORDER BY CD.lcnChannel
      `,
        [+id]
      );

      resolve(channel);
      // resolve(result);
    } catch (error) {
      // console.log(">>> check error: ", error);
      reject(error);
    }
  });
};

let getChannelMonitorBusiness = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          EM: "Missing parameter!",
          EC: 1,
          DT: [],
        });
      } else {
        let channel = await getAllChannelBusiness(id);

        resolve({
          EM: "Get channel moniter all success!",
          EC: 0,
          DT: channel,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getChanelandCountBusiness = (page, limit, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await mysql.createConnection({
        host: "172.29.2.91",
        user: "newstage",
        password: "newstage123#@!",
        database: "JWT_DB",
        Promise: bluebird,
      });
      let offset = (page - 1) * limit;
      let result = {};

      const [channel, fields] = await connection.execute(
        `SELECT D.vendorId, CD.lcnChannel, C.channelType, C.axingChannelName, C.gospellChannelName
        FROM DEVICE AS D 
        JOIN CHANNEL_DEVICE AS CD ON D.id = CD.deviceId 
        JOIN CHANNEL AS C ON CD.channelId = C.id
        WHERE D.areaId = ?
        ORDER BY CD.lcnChannel
        LIMIT ?
        OFFSET ?`,
        [id, limit, offset]
      );

      result = { ...result, channel };

      const [count, item] = await connection.execute(
        `SELECT COUNT(D.id) AS "count"
        FROM DEVICE AS D 
        JOIN CHANNEL_DEVICE AS CD ON D.id = CD.deviceId 
        JOIN CHANNEL AS C ON CD.channelId = C.id
        WHERE D.areaId = ?
        ORDER BY CD.lcnChannel`,
        [id]
      );
      result = { ...result, count };
      resolve(result);
    } catch (error) {
      // console.log(">>> check error: ", error);
      reject(error);
    }
  });
};

let getChannelMonitorWithPaginationBusiness = (page, limit, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id || !page || !limit) {
        resolve({
          EM: "Missing parameter!",
          EC: 1,
          DT: [],
        });
      } else {
        let { channel, count } = await getChanelandCountBusiness(
          page,
          limit,
          id
        );
        let totalPages = Math.ceil(count[0].count / limit);
        let data = {
          totalRows: count[0].count,
          totalPages: totalPages,
          data: channel,
        };

        resolve({
          EM: "Get channel moniter pagination success!",
          EC: 0,
          DT: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
//end phòng kinh doanh

let getOneChannelMonitor = (channelId, deviceId) => {
  return new Promise(async (resolve, reject) => {
    // try {
    //   if (!channelId || !deviceId) {
    //     resolve({
    //       errCode: 1,
    //       errMessage: "Missing parameter!",
    //     });
    //   } else {
    //     let data = await db.CHANNEL_DEVICE.findOne({
    //       where: {
    //         [Op.and]: [{ channelId: +channelId }, { deviceId: +deviceId }],
    //       },
    //       attributes: [
    //         "channelId",
    //         "deviceId",
    //         "lcnChannel",
    //         "frequency",
    //         "channelStatus",
    //         "channelStatusPlay",
    //       ],
    //       include: [
    //         {
    //           model: db.CHANNEL,
    //           as: "dataChannelName",
    //           attributes: [
    //             "channelName",
    //             "channelIP",
    //             "channelPort",
    //             "channelDescription",
    //             "channelImage"
    //           ],
    //         },
    //       ],

    //       raw: true,
    //       nest: true,
    //     });
    //     if (data) {
    //       resolve({
    //         EM: "Get one channel moniter array success!",
    //         EC: 0,
    //         DT: [data],
    //       });
    //     } else {
    //       resolve({
    //         EM: "Get one channel is not found!",
    //         EC: 1,
    //         DT: {},
    //       });
    //     }
    //   }
    // } catch (e) {
    //   reject(e);
    // }

    try {
      const connection = await mysql.createConnection({
        host: "172.29.2.91",
        user: "newstage",
        password: "newstage123#@!",
        database: "JWT_DB",
        Promise: bluebird,
      });

      const [channel, fields] = await connection.execute(
        `SELECT D.ipAddress, D.description,D.vendorId, CD.lcnChannel, C.id AS "channelId",C.axingChannelName,C.channelType, C.channelDescription, C.channelIP, C.channelImage, C.channelPort,C.gospellChannelName,
        CD.frequency
      FROM CHANNEL_DEVICE AS CD
      JOIN CHANNEL AS C ON CD.channelId = C.id
      JOIN DEVICE AS D ON CD.deviceId = D.id
      WHERE CD.channelId = ? AND CD.deviceId = ?
      `,
        [+channelId, +deviceId]
      );

      resolve(channel);
    } catch (error) {
      // console.log(">>> check error: ", error);
      reject(error);
    }
  });
};

let findChannelMultiMonitor = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.cuong) {
        resolve({
          EM: 1,
          EC: "Missing parameter!",
          DT: [],
        });
      } else {
        console.log("check data convert: ", JSON.parse(data.cuong));
        let channelCovertMulti = JSON.parse(data.cuong);
        let resultChannelMultiSearch = [];
        for (let i = 0; i < channelCovertMulti.length; i++) {
          const connection = await mysql.createConnection({
            host: "172.29.2.91",
            user: "newstage",
            password: "newstage123#@!",
            database: "JWT_DB",
            Promise: bluebird,
          });
          const [channel, fields] = await connection.execute(
            `SELECT D.ipAddress, D.description,D.vendorId, CD.lcnChannel, C.id AS "channelId",C.axingChannelName, C.gospellChannelName
            ,C.channelType, C.channelDescription, C.channelIP, C.channelImage, C.channelPort, CD.frequency
          FROM CHANNEL_DEVICE AS CD
          JOIN CHANNEL AS C ON CD.channelId = C.id
          JOIN DEVICE AS D ON CD.deviceId = D.id
          WHERE CD.channelId = ? AND CD.deviceId = ?
          `,
            [+channelCovertMulti[i].value, +channelCovertMulti[i].deviceId]
          );

          resultChannelMultiSearch = resultChannelMultiSearch.concat(channel);
        }
        // console.log(
        //   "check data result channel mutil: ",
        //   resultChannelMultiSearch
        // );
        // resolve(channel);
        if (resultChannelMultiSearch) {
          resolve(resultChannelMultiSearch);
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getFrequencyChannell = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.FREQUENCY.findAll({
        attributes: ["id", "frequency", "description", "status"],
        raw: true,
        nest: true,
      });

      if (data) {
        resolve({
          EM: "Get all frequency moniter array success!",
          EC: 0,
          DT: data,
        });
      } else {
        resolve({
          EM: "Get frequency is not found!",
          EC: 1,
          DT: {},
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getFrequencyChannelDevice = (areaId, frequency) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!frequency || !areaId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        let channel = await getAllChannel(+areaId);
        let data = channel.filter((item) => {
          if (item.frequency === frequency) return item;
        });

        if (data) {
          resolve({
            EM: "Get frequency channel moniter array success!",
            EC: 0,
            DT: data,
          });
        } else {
          resolve({
            EM: "Get frequency channel is not found!",
            EC: 1,
            DT: {},
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllChannelAdmin = (page, limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!page || !limit) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter!",
        });
      } else {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.CHANNEL.findAndCountAll({
          order: [["id", "ASC"]],
          attributes: [
            "channelName",
            "axingChannelName",
            "channelIP",
            "channelPort",
            "channelType",
            "channelDescription",
            "channelStatus",
            "channelImage",
          ],
          raw: true,
          nest: true,
          offset: offset,
          limit: limit,
        });

        let totalPages = Math.ceil(count / limit);
        let data = {
          totalRows: count,
          totalPages: totalPages,
          data: rows,
        };
        resolve({
          EM: "Get All channel moniter pagination success!",
          EC: 0,
          DT: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getChannelCatchup = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await mysql.createConnection({
        host: "172.29.3.135",
        user: "newstage",
        password: "newstage123#@!",
        database: "cms",
        Promise: bluebird,
      });

      const [channel, fields] = await connection.execute(
        `SELECT N.CHANNEL_ID, N.CHANNEL_NAME FROM CHANNEL N WHERE N.CHANNEL_ID = 112 or N.CHANNEL_ID = 2 or N.CHANNEL_ID = 108 or N.CHANNEL_ID = 36 or N.CHANNEL_ID = 16 or N.CHANNEL_ID = 107 or N.CHANNEL_ID = 140 or N.CHANNEL_ID = 114 or N.CHANNEL_ID = 14 or N.CHANNEL_ID = 147 or N.CHANNEL_ID = 164 or N.CHANNEL_ID = 119 or N.CHANNEL_ID = 41 or N.CHANNEL_ID = 137 or N.CHANNEL_ID = 130 or N.CHANNEL_ID = 85 or N.CHANNEL_ID = 129 or N.CHANNEL_ID = 84 or N.CHANNEL_ID = 17 or N.CHANNEL_ID = 109 or N.CHANNEL_ID = 22 ORDER BY N.CHANNEL_ID;
      `
      );

      resolve({
        EM: "Get channel catchup success!",
        EC: 0,
        DT: channel,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const convertDaySchedule = (data) => {
  let schedule = [];
  for (let i = 0; i < data.length; i++) {
    let dayStart = moment(data[i].CATCHUP_STARTTIME).utc(7).format("HH:mm:ss");
    let dayEnd = moment(data[i].CATCHUP_ENDTIME).utc(7).format("HH:mm:ss");
    let object = {
      ...data[i],
      CATCHUP_STARTTIME: dayStart,
      CATCHUP_ENDTIME: dayEnd,
    };
    schedule.push(object);
  }
  return schedule;
};

let getScheduleChannelCatchup = (channelCatchupId, dayCatchup) => {
  return new Promise(async (resolve, reject) => {
    // console.log("convert Day: ", channelCatchupId, dayCatchup);
    try {
      if (!channelCatchupId || !dayCatchup) {
        resolve({
          EM: "Missing paramter!",
          EC: 0,
          DT: "",
        });
      } else {
        const connection = await mysql.createConnection({
          host: "172.29.3.135",
          user: "newstage",
          password: "newstage123#@!",
          database: "cms",
          Promise: bluebird,
        });

        const [channelCatchup, fields] = await connection.execute(
          `SELECT CATCHUP_NAME, CATCHUP_STARTTIME, CATCHUP_ENDTIME, CATCHUP_PATH FROM CATCHUP WHERE CHANNEL_ID = ? AND CATCHUP_STARTTIME LIKE ? ORDER BY CATCHUP_STARTTIME, CATCHUP_ENDTIME
          `,
          [+channelCatchupId, dayCatchup]
        );

        // console.log("day return: ", channelCatchup);
        let result = convertDaySchedule(channelCatchup);
        console.log("day return: ", result);
        resolve({
          EM: "Get channel catchup success!",
          EC: 0,
          DT: result,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  getAreaMonitor,
  getChannelMonitorWithPagination,
  getChannelMonitor,
  getOneChannelMonitor,
  findChannelMultiMonitor,
  getFrequencyChannell,
  getFrequencyChannelDevice,
  getAllChannelAdmin,
  getChannelCatchup,
  getScheduleChannelCatchup,
  getDeviceRaspbery,
  getChannels,
  actionChannels,
  getAreaMonitorT2,
  getChannelMonitorBusiness,
  getChannelMonitorWithPaginationBusiness,
};
