import channelService from "../service/channelService";

let getAreaMonitorT2 = async (req, res) => {
  try {
    let data = await channelService.getAreaMonitorT2();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      EM: "error from server",
      EC: -1,
      DT: "",
    });
  }
};

let getAreaMonitor = async (req, res) => {
  try {
    let data = await channelService.getAreaMonitor(req.query.id);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

let getDeviceRaspbery = async (req, res) => {
  try {
    let data = await channelService.getDeviceRaspbery(req.query.id);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

let getChannels = async (req, res) => {
  try {
    let data = await channelService.getChannels(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      monitoring_channel_count: data.monitoring_channel_count,
      channels: data.channels,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

let actionChannels = async (req, res) => {
  try {
    console.log("check request: ", req.body);
    let data = await channelService.actionChannels(req.body);
    console.log("check reponse: ", data);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

let getOneChannelMonitor = async (req, res) => {
  try {
    let channel = await channelService.getOneChannelMonitor(
      +req.query.channelId,
      +req.query.deviceId
    );
    return res.status(200).json({
      EM: "Search One Channel Succee!",
      EC: 0,
      DT: channel,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server",
      EC: -1,
      DT: "",
    });
  }
};

let findChannelMultiMonitor = async (req, res) => {
  try {
    // console.log("check request body: ", req);
    let channelMulti = await channelService.findChannelMultiMonitor(req.body);
    return res.status(200).json({
      EM: "Search channelMulti Succee!",
      EC: 0,
      DT: channelMulti,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server",
      EC: -1,
      DT: "",
    });
  }
};

let getChannelMonitorBusiness = async (req, res) => {
  try {
    if (req.query.page && req.query.limit && req.query.id) {
      let page = req.query.page;
      let limit = req.query.limit;
      let id = req.query.id;

      let data = await channelService.getChannelMonitorWithPaginationBusiness(
        +page,
        +limit,
        +id
      );
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await channelService.getChannelMonitorBusiness(+req.query.id);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      EM: "error from server",
      EC: -1,
      DT: "",
    });
  }
};

let getChannelMonitor = async (req, res) => {
  try {
    if (req.query.page && req.query.limit && req.query.id) {
      let page = req.query.page;
      let limit = req.query.limit;
      let id = req.query.id;

      let data = await channelService.getChannelMonitorWithPagination(
        +page,
        +limit,
        +id
      );
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await channelService.getChannelMonitor(+req.query.id);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

let getFrequencyChannell = async (req, res) => {
  try {
    let channel = await channelService.getFrequencyChannell();
    return res.status(200).json({
      EM: channel.EM,
      EC: channel.EC,
      DT: channel.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EC: -1,
      EM: "Error from the server",
    });
  }
};

let getAllChannel = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let response = await channelService.getAllChannelAdmin(+page, +limit);
      return res.status(200).json({
        EM: response.EM,
        EC: response.EC,
        DT: response.DT,
      });
    } else {
      return res.status(200).json({
        EM: "Missing parameter!",
        EC: -1,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EC: -1,
      EM: "Error from the server",
    });
  }
};

let getFrequencyChannelDevice = async (req, res) => {
  try {
    if (req.query.areaId && req.query.frequency) {
      let areaId = req.query.areaId;
      let frequency = req.query.frequency;
      let response = await channelService.getFrequencyChannelDevice(
        +areaId,
        +frequency
      );
      return res.status(200).json({
        EM: response.EM,
        EC: response.EC,
        DT: response.DT,
      });
    } else {
      return res.status(200).json({
        EM: "Missing parameter!",
        EC: -1,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EC: -1,
      EM: "Error from the server",
    });
  }
};

let getChannelCatchup = async (req, res) => {
  try {
    if (true) {
      let response = await channelService.getChannelCatchup();
      return res.status(200).json({
        EM: response.EM,
        EC: response.EC,
        DT: response.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EC: -1,
      EM: "Error from the server",
    });
  }
};

let getScheduleChannelCatchup = async (req, res) => {
  try {
    if (true) {
      let dayTime = `%${req.query.dayCatchup}%`;
      let response = await channelService.getScheduleChannelCatchup(
        req.query.channelCatchupId,
        dayTime
      );
      return res.status(200).json({
        EM: response.EM,
        EC: response.EC,
        DT: response.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EC: -1,
      EM: "Error from the server",
    });
  }
};

module.exports = {
  getAreaMonitor,
  getChannelMonitor,
  getOneChannelMonitor,
  getFrequencyChannell,
  getAllChannel,
  getFrequencyChannelDevice,
  getChannelCatchup,
  getScheduleChannelCatchup,
  findChannelMultiMonitor,
  getDeviceRaspbery,
  getChannels,
  actionChannels,
  getAreaMonitorT2,
  getChannelMonitorBusiness,
};
