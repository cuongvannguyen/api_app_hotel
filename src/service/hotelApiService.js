import db from "../models/index";
require("dotenv").config();
import { Op } from "sequelize";
import axios from "axios";

const handleGetCategoryViaChannel = async () => {
  try {
    let count = await db.CHANNEL.count({
      where: { CHANNEL_STATUS: 1 },
      distinct: true,
      col: "id",
    });

    let channels = await db.CHANNEL_CATE.findAll({
      attributes: ["CATE_NAME_VI", "CATE_NAME_EN"],
      include: [
        {
          model: db.CHANNEL,
          attributes: [
            "CHANNEL_NAME_VI",
            "CHANNEL_NAME_EN",
            "CHANNEL_LINK",
            "CHANNEL_URL_HLS",
            "CHANNEL_MULTICAST_URL",
          ],
          where: { CHANNEL_STATUS: 1 },
          through: {
            attributes: ["CHANNEL_ORDER"],
          },
        },
      ],
      where: { CATE_STATUS: 1 },
      order: [
        ["SORT_ORDER", "ASC"],
        [db.CHANNEL, db.CHANNEL_CATE_MAP, "CHANNEL_ORDER", "ASC"],
      ],
    });

    if (channels) {
      return {
        EM: "get All Channel Via Category Success!",
        EC: 0,
        DT: channels,
        Channel: count,
      };
    } else {
      return {
        EM: "get All Channel Via Category Fail",
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

const handleGetInforApp = async () => {
  try {
    let appInfor = await db.APP_LOGIN.findOne({
      attributes: ["APP_NAME", "APP_TITLE", "APP_BACKGROUND"],
      where: { id: 1 },
    });
    if (appInfor) {
      return {
        EM: "get infor app Success!",
        EC: 0,
        DT: appInfor,
      };
    } else {
      return {
        EM: "get infor app Fail!",
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

const handleGetAllListChannel = async () => {
  let channels = await db.CHANNEL.findAll({
    attributes: [
      "CHANNEL_NAME_VI",
      "CHANNEL_NAME_EN",
      "CHANNEL_LINK",
      "CHANNEL_ORDER",
      "CHANNEL_URL_HLS",
      "CHANNEL_MULTICAST_URL",
    ],
    where: { CHANNEL_STATUS: 1 },

    order: [["CHANNEL_ORDER", "ASC"]],
  });

  if (channels) {
    return {
      EM: "get All Channel For LiveTv Success!",
      EC: 0,
      DT: channels,
    };
  } else {
    return {
      EM: "get All Channel For LiveTv Fail",
      EC: 1,
      DT: "",
    };
  }
};

const handleGetRoomHotel = async (keyBox) => {
  try {
    const roomId = await db.DEVICE_MEMBER.findOne({
      where: {
        [Op.or]: [{ MAC_DEVICE: keyBox.toUpperCase() }, { SSID: keyBox }],
      },
      attributes: ["ROOM_ID"],
    });

    const roomDetail = await db.ROOM.findOne({
      where: { id: roomId.dataValues.ROOM_ID },
      attributes: ["ROOM_NAME"],
      include: [
        {
          model: db.INFORMATION_HOTEL,
          attributes: [
            "OPEN_LETTER_VI",
            "OPEN_LETTER_EN",
            "CONTENT_TITLE_VI",
            "CONTENT_TITLE_EN",
            "BACKGROUND_LINK",
          ],
        },
        {
          model: db.INFORMATION_WIFI,
          attributes: ["SSID", "PASSWORD"],
        },
        {
          model: db.GUEST,
          attributes: ["GUEST_NAME"],
          where: { STATUS: 1 },
          required: false,
        },
      ],
    });
    return {
      EM: "Get Room success",
      EC: 0,
      DT: roomDetail,
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

const API_KEY = "d6e51cf5871fae4df8e5df02990c4150";
const cities = {
  hanoi: "Hanoi,vn",
  hochiminh: "Ho Chi Minh,vn",
  danang: "Danang,vn",
  // Thêm các thành phố khác tùy ý
};

const getWeatherDataApp = async (cityName) => {
  try {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${cities[cityName]}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getWeatherData = async (cityName) => {
  try {
    const weatherData = await getWeatherDataApp(cityName);
    if (cityName === "hochiminh") {
      const weatherInfo = {
        city: weatherData.name,
        city_vn: "Tp Hồ Chí Minh",
        temperature: weatherData.main.temp.toFixed(0),
        description: weatherData.weather[0].description,
        humidity: weatherData.main.humidity,
      };
      if (weatherInfo) {
        return {
          EM: "Get weather success",
          EC: 0,
          DT: weatherInfo,
        };
      } else {
        return {
          EM: "Get weather fail",
          EC: 0,
          DT: {
            city: "Ho Chi Minh City",
            city_vn: "Tp Hồ Chí Minh",
            temperature: 30,
            description: "broken clouds",
            humidity: 89,
          },
        };
      }
    }

    const weatherInfo = {
      city: weatherData.name,
      temperature: weatherData.main.temp.toFixed(0),
      description: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
    };
    if (weatherInfo) {
      return {
        EM: "Get weather success",
        EC: 0,
        DT: weatherInfo,
      };
    } else {
      return {
        EM: "Get weather fail",
        EC: 0,
        DT: {
          city: "Ho Chi Minh City",
          temperature: 28,
          description: "broken clouds",
          humidity: 89,
        },
      };
    }
  } catch (error) {
    res.status(404).json({ message: "City not found." });
  }
};

const handleGetListSidebar = async () => {
  let hotel = await db.HOTEL.findAll({
    attributes: ["LOGO_HORIZONTAL_LINK"],
    raw: true,
  });
  let sibars = await db.CONTENT_SIDEBAR.findAll({
    attributes: [
      "id",
      "NAME_VI",
      "NAME_EN",
      "SIDEBAR_ICON_LINK",
      "URL_SIDEBAR",
    ],
    where: { STATUS: 1 },
    order: [["SORT_ORDER", "ASC"]],
    raw: true,
  });

  let result = [hotel, sibars];
  return {
    EM: "get sidebar app successfully!",
    EC: 0,
    DT: result,
  };
};

const handleGetListServiceHotel = async () => {
  try {
    const { count, rows } = await db.CATEGORY_SERVICE.findAndCountAll({
      attributes: ["CATEGORY_NAME_VI", "CATEGORY_NAME_EN", "STATUS"],
      include: [
        {
          model: db.SERVICE_HOTEL,
          attributes: [
            "SERVICE_LINK",
            "TITLE_EN",
            "SERVICE_DESCRIPTION_EN",
            "TITLE_VI",
            "SERVICE_DESCRIPTION_VI",
            "STATUS",
            "IS_SHOW_TEXT",
          ],
          where: { STATUS: 1 },
          required: false,
        },
      ],
      where: { STATUS: 1 },

      order: [
        ["SORT_ORDER", "ASC"],
        [db.SERVICE_HOTEL, "ORDER", "ASC"],
      ],
    });
    // let data = {
    //   services: rows,
    // };
    return {
      EM: "get service hotel success",
      EC: 0,
      DT: rows,
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

const handleGetListMenuHotel = async () => {
  try {
    const { count, rows } = await db.CATEGORY_MENU.findAndCountAll({
      attributes: ["CATEGORY_NAME_VI", "CATEGORY_NAME_EN", "STATUS"],
      include: [
        {
          model: db.MENU_HOTEL,
          attributes: [
            "SERVICE_LINK",
            "TITLE_EN",
            "SERVICE_DESCRIPTION_EN",
            "TITLE_VI",
            "SERVICE_DESCRIPTION_VI",
            "STATUS",
            "IS_SHOW_TEXT",
          ],
          where: { STATUS: 1 },
          required: false,
        },
      ],
      where: { STATUS: 1 },

      order: [
        ["SORT_ORDER", "ASC"],
        [db.MENU_HOTEL, "ORDER", "ASC"],
      ],
    });
    return {
      EM: "get menu hotel success",
      EC: 0,
      DT: rows,
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

const handleGetListExploreHotel = async () => {
  try {
    const { count, rows } = await db.CATEGORY_EXPLORE.findAndCountAll({
      attributes: ["CATEGORY_NAME_VI", "CATEGORY_NAME_EN", "STATUS"],
      include: [
        {
          model: db.EXPLORE_HOTEL,
          attributes: [
            "SERVICE_LINK",
            "TITLE_EN",
            "SERVICE_DESCRIPTION_EN",
            "TITLE_VI",
            "SERVICE_DESCRIPTION_VI",
            "STATUS",
            "IS_SHOW_TEXT",
          ],
          where: { STATUS: 1 },
          required: false,
        },
      ],
      where: { STATUS: 1 },

      order: [
        ["SORT_ORDER", "ASC"],
        [db.EXPLORE_HOTEL, "ORDER", "ASC"],
      ],
    });
    // let data = {
    //   services: rows,
    // };
    return {
      EM: "get explore hotel success",
      EC: 0,
      DT: rows,
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

const handleGetListGuideHotel = async () => {
  try {
    const { count, rows } = await db.CATEGORY_GUIDE.findAndCountAll({
      attributes: ["CATEGORY_NAME_VI", "CATEGORY_NAME_EN", "STATUS"],
      include: [
        {
          model: db.GUIDE_HOTEL,
          attributes: [
            "SERVICE_LINK",
            "SERVICE_DESCRIPTION_EN",
            "SERVICE_DESCRIPTION_VI",
            "STATUS",
            "IS_SHOW_TEXT",
          ],
          where: { STATUS: 1 },
          required: false,
        },
      ],
      where: { STATUS: 1 },

      order: [
        ["SORT_ORDER", "ASC"],
        [db.GUIDE_HOTEL, "ORDER", "ASC"],
      ],
    });
    // let data = {
    //   services: rows,
    // };
    return {
      EM: "get explore hotel success",
      EC: 0,
      DT: rows,
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

const handleGetChannelByKey = async (keyBox) => {
  try {
    const playerType = await db.DEVICE_MEMBER.findOne({
      where: {
        SSID: keyBox,
      },
      attributes: ["DEVICE_PLAYER_TYPE"],
      raw: true,
    });

    if (playerType) {
      if (playerType.DEVICE_PLAYER_TYPE === "OTT") {
        let count = await db.CHANNEL.count({
          where: { CHANNEL_STATUS: 1 },
          distinct: true,
          col: "id",
        });

        let channels = await db.CHANNEL_CATE.findAll({
          attributes: ["CATE_NAME_VI", "CATE_NAME_EN"],
          include: [
            {
              model: db.CHANNEL,
              attributes: [
                "CHANNEL_NAME_VI",
                "CHANNEL_NAME_EN",
                "CHANNEL_LINK",
                "CHANNEL_URL_HLS",
                "CHANNEL_MULTICAST_URL",
                "CHANNEL_PROFILE_URL",
              ],
              where: { CHANNEL_STATUS: 1 },
              through: {
                attributes: ["CHANNEL_ORDER"],
              },
            },
          ],
          where: { CATE_STATUS: 1 },
          order: [
            ["SORT_ORDER", "ASC"],
            [db.CHANNEL, db.CHANNEL_CATE_MAP, "CHANNEL_ORDER", "ASC"],
          ],
          // raw: true,
        });

        // if (channels && channels.length > 0) {
        //   for (let i = 0; i < channels.length; i++) {
        //     // console.log("check data: ", i, "  ", channels[i]);
        //     if (
        //       channels[i].dataValues &&
        //       channels[i].dataValues.CHANNELs.length > 0
        //     ) {
        //       for (let j = 0; j < channels[i].dataValues.CHANNELs.length; j++) {
        //         console.log(
        //           "check data: ",
        //           j,
        //           "  ",
        //           channels[i].dataValues.CHANNELs[j]
        //         );
        //       }
        //     }
        //   }
        // }
        // let data = channels[1];
        // console.log("lấy dữ liệu:", data.dataValues.CHANNELs[0].dataValues);

        if (channels) {
          return {
            EM: "Lấy danh sách kênh IPTV loại OTT thành công!",
            EC: 0,
            DT: channels,
            Channel: count,
            Player: "OTT",
          };
        } else {
          return {
            EM: "Không có kênh OTT nào trả về!",
            EC: 1,
            DT: "",
          };
        }
      } else {
        let count = await db.CHANNEL.count({
          where: { CHANNEL_STATUS: 1 },
          distinct: true,
          col: "id",
        });

        let channels = await db.CHANNEL_CATE.findAll({
          attributes: ["CATE_NAME_VI", "CATE_NAME_EN"],
          include: [
            {
              model: db.CHANNEL,
              attributes: [
                "CHANNEL_NAME_VI",
                "CHANNEL_NAME_EN",
                "CHANNEL_LINK",
                "CHANNEL_MULTICAST_URL",
                "CHANNEL_URL_HLS",
                "CHANNEL_PROFILE_URL",
              ],
              where: { CHANNEL_STATUS: 1 },
              through: {
                attributes: ["CHANNEL_ORDER"],
              },
            },
          ],
          where: { CATE_STATUS: 1 },
          order: [
            ["SORT_ORDER", "ASC"],
            [db.CHANNEL, db.CHANNEL_CATE_MAP, "CHANNEL_ORDER", "ASC"],
          ],
        });

        // console.log("check data: ", channels);

        if (channels) {
          return {
            EM: "Lấy danh sách kênh IPTV loại UDP thành công!",
            Player: "UDP",
            EC: 0,
            DT: channels,
            Channel: count,
          };
        } else {
          return {
            EM: "Không có kênh IPTV nào trả về!",
            EC: 1,
            DT: "",
          };
        }
      }
    } else {
      return {
        EM: "Thiết bị không tìm thấy trong hệ thống",
        EC: 1,
        DT: [],
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

const handleGetChannelByKey0 = async (keyBox) => {
  try {
    const playerType = await db.DEVICE_MEMBER.findOne({
      where: {
        SSID: keyBox,
      },
      attributes: ["DEVICE_PLAYER_TYPE"],
      raw: true,
    });

    if (playerType) {
      if (playerType.DEVICE_PLAYER_TYPE === "OTT") {
        let count = await db.CHANNEL.count({
          where: { CHANNEL_STATUS: 1 },
          distinct: true,
          col: "id",
        });

        let channels = await db.CHANNEL_CATE.findAll({
          attributes: ["CATE_NAME_VI", "CATE_NAME_EN"],
          include: [
            {
              model: db.CHANNEL,
              attributes: [
                "CHANNEL_NAME_VI",
                "CHANNEL_NAME_EN",
                "CHANNEL_LINK",
                "CHANNEL_URL_HLS",
              ],
              where: { CHANNEL_STATUS: 1 },
              through: {
                attributes: ["CHANNEL_ORDER"],
              },
            },
          ],
          where: { CATE_STATUS: 1 },
          order: [
            ["SORT_ORDER", "ASC"],
            [db.CHANNEL, db.CHANNEL_CATE_MAP, "CHANNEL_ORDER", "ASC"],
          ],
          // raw: true,
        });

        if (channels) {
          return {
            EM: "Lấy danh sách kênh IPTV loại OTT thành công!",
            EC: 0,
            DT: channels,
            Channel: count,
            Player: "OTT",
          };
        } else {
          return {
            EM: "Không có kênh OTT nào trả về!",
            EC: 1,
            DT: "",
          };
        }
      } else {
        let count = await db.CHANNEL.count({
          where: { CHANNEL_STATUS: 1 },
          distinct: true,
          col: "id",
        });

        let channels = await db.CHANNEL_CATE.findAll({
          attributes: ["CATE_NAME_VI", "CATE_NAME_EN"],
          include: [
            {
              model: db.CHANNEL,
              attributes: [
                "CHANNEL_NAME_VI",
                "CHANNEL_NAME_EN",
                "CHANNEL_LINK",
                "CHANNEL_MULTICAST_URL",
              ],
              where: { CHANNEL_STATUS: 1 },
              through: {
                attributes: ["CHANNEL_ORDER"],
              },
            },
          ],
          where: { CATE_STATUS: 1 },
          order: [
            ["SORT_ORDER", "ASC"],
            [db.CHANNEL, db.CHANNEL_CATE_MAP, "CHANNEL_ORDER", "ASC"],
          ],
        });

        // console.log("check data: ", channels);

        if (channels) {
          return {
            EM: "Lấy danh sách kênh IPTV loại UDP thành công!",
            Player: "UDP",
            EC: 0,
            DT: channels,
            Channel: count,
          };
        } else {
          return {
            EM: "Không có kênh IPTV nào trả về!",
            EC: 1,
            DT: "",
          };
        }
      }
    } else {
      return {
        EM: "Thiết bị không tìm thấy trong hệ thống",
        EC: 1,
        DT: [],
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

const handleGetListMenuChannelByKey = async (keyBox) => {
  try {
    const playerType = await db.DEVICE_MEMBER.findOne({
      where: {
        SSID: keyBox,
      },
      attributes: ["DEVICE_PLAYER_TYPE"],
      raw: true,
    });

    if (playerType) {
      if (playerType.DEVICE_PLAYER_TYPE === "OTT") {
        //before config
        // let channels = await db.CHANNEL.findAll({
        //   attributes: [
        //     "CHANNEL_NAME_VI",
        //     "CHANNEL_NAME_EN",
        //     "CHANNEL_LINK",
        //     "CHANNEL_ORDER",
        //     "CHANNEL_MULTICAST_URL",
        //     "CHANNEL_URL_HLS",
        //     "CHANNEL_PROFILE_URL",
        //   ],
        //   where: { CHANNEL_STATUS: 1 },

        //   order: [["CHANNEL_ORDER", "ASC"]],

        // });

        let channels = await db.CHANNEL.findAll({
          attributes: [
            "CHANNEL_NAME_VI",
            "CHANNEL_NAME_EN",
            "CHANNEL_LINK",
            "CHANNEL_ORDER",
            "CHANNEL_MULTICAST_URL",
            "CHANNEL_URL_HLS",
            "CHANNEL_PROFILE_URL",
          ],
          where: { CHANNEL_STATUS: 1 },

          order: [["CHANNEL_ORDER", "ASC"]],
          raw: true,
        });

        let channelOTT = [];
        for (let i = 0; i < channels.length; i++) {
          channels[i].CHANNEL_PROFILE_URL = "OTT";
          channelOTT.push(channels[i]);
        }

        if (channelOTT) {
          return {
            EM: "Lấy danh sách Channel OTT cho Menu thành công",
            EC: 0,
            DT: channelOTT,
          };
        } else {
          return {
            EM: "Lấy danh sách Channel OTT cho Menu thất bại",
            EC: 1,
            DT: "",
          };
        }
      } else {
        let channels = await db.CHANNEL.findAll({
          attributes: [
            "CHANNEL_NAME_VI",
            "CHANNEL_NAME_EN",
            "CHANNEL_LINK",
            "CHANNEL_ORDER",
            "CHANNEL_MULTICAST_URL",
            "CHANNEL_URL_HLS",
            "CHANNEL_PROFILE_URL",
          ],
          where: { CHANNEL_STATUS: 1 },
          order: [["CHANNEL_ORDER", "ASC"]],
          raw: true,
        });

        let channelUDP = [];
        for (let i = 0; i < channels.length; i++) {
          if (channels[i] && channels[i].CHANNEL_PROFILE_URL) {
            channels[i].CHANNEL_PROFILE_URL = "OTT";
            channelUDP.push(channels[i]);
          } else {
            channels[i].CHANNEL_PROFILE_URL = "UDP";
            channelUDP.push(channels[i]);
          }
        }

        if (channels) {
          return {
            EM: "Lấy danh sách Channel UDP cho Menu thành công!",
            EC: 0,
            DT: channelUDP,
          };
        } else {
          return {
            EM: "Lấy danh sách Channel UDP cho Menu thất bại",
            EC: 1,
            DT: "",
          };
        }
      }
    } else {
      return {
        EM: "Thiết bị không tìm thấy trong hệ thống",
        EC: 1,
        DT: [],
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

const handleGetListMenuChannelByKey0 = async (keyBox) => {
  try {
    const playerType = await db.DEVICE_MEMBER.findOne({
      where: {
        SSID: keyBox,
      },
      attributes: ["DEVICE_PLAYER_TYPE"],
      raw: true,
    });

    if (playerType) {
      if (playerType.DEVICE_PLAYER_TYPE === "OTT") {
        let channels = await db.CHANNEL.findAll({
          attributes: [
            "CHANNEL_NAME_VI",
            "CHANNEL_NAME_EN",
            "CHANNEL_LINK",
            "CHANNEL_ORDER",
            "CHANNEL_URL_HLS",
          ],
          where: { CHANNEL_STATUS: 1 },

          order: [["CHANNEL_ORDER", "ASC"]],
          // raw: true,
        });

        if (channels) {
          return {
            EM: "Lấy danh sách Channel OTT cho Menu thành công",
            EC: 0,
            DT: channels,
          };
        } else {
          return {
            EM: "Lấy danh sách Channel OTT cho Menu thất bại",
            EC: 1,
            DT: "",
          };
        }
      } else {
        let channels = await db.CHANNEL.findAll({
          attributes: [
            "CHANNEL_NAME_VI",
            "CHANNEL_NAME_EN",
            "CHANNEL_LINK",
            "CHANNEL_ORDER",
            "CHANNEL_MULTICAST_URL",
          ],
          where: { CHANNEL_STATUS: 1 },
          order: [["CHANNEL_ORDER", "ASC"]],
        });

        if (channels) {
          return {
            EM: "Lấy danh sách Channel UDP cho Menu thành công!",
            EC: 0,
            DT: channels,
          };
        } else {
          return {
            EM: "Lấy danh sách Channel UDP cho Menu thất bại",
            EC: 1,
            DT: "",
          };
        }
      }
    } else {
      return {
        EM: "Thiết bị không tìm thấy trong hệ thống",
        EC: 1,
        DT: [],
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

module.exports = {
  handleGetCategoryViaChannel,
  handleGetRoomHotel,
  handleGetAllListChannel,
  getWeatherData,
  handleGetListSidebar,
  handleGetListServiceHotel,
  handleGetListMenuHotel,
  handleGetListExploreHotel,
  handleGetListGuideHotel,
  handleGetInforApp,
  handleGetChannelByKey,
  handleGetListMenuChannelByKey,
  handleGetChannelByKey0,
  handleGetListMenuChannelByKey0,
};
