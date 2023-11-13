import hotelApiService from "../service/hotelApiService";

const handleGetCategoryViaChannel = async (req, res) => {
  try {
    let response = await hotelApiService.handleGetCategoryViaChannel();
    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      Count: response.Channel,
      DT: response.DT,
    });
  } catch {
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleGetInforApp = async (req, res) => {
  try {
    let response = await hotelApiService.handleGetInforApp();
    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch {
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleGetAllListChannel = async (req, res) => {
  try {
    let response = await hotelApiService.handleGetAllListChannel();
    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch {
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleGetRoomHotel = async (req, res) => {
  try {
    if (req.query.keyBox) {
      let keyBox = req.query.keyBox;
      let data = await hotelApiService.handleGetRoomHotel(keyBox);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const getWeatherData = async (req, res) => {
  try {
    const cityName = req.params.cityName;
    if (cityName) {
      let data = await hotelApiService.getWeatherData(cityName);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleGetListSidebar = async (req, res) => {
  try {
    let data = await hotelApiService.handleGetListSidebar();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleGetListServiceHotel = async (req, res) => {
  try {
    let data = await hotelApiService.handleGetListServiceHotel();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleGetListMenuHotel = async (req, res) => {
  try {
    let data = await hotelApiService.handleGetListMenuHotel();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleGetListExploreHotel = async (req, res) => {
  try {
    let data = await hotelApiService.handleGetListExploreHotel();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleGetListGuideHotel = async (req, res) => {
  try {
    let data = await hotelApiService.handleGetListGuideHotel();
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleGetChannelByKey = async (req, res) => {
  try {
    if (req.query.keyBox) {
      let keyBox = req.query.keyBox;
      let response = await hotelApiService.handleGetChannelByKey0(keyBox);
      return res.status(200).json({
        EM: response.EM,
        EC: response.EC,
        Count: response.Channel,
        Player: response.Player,
        DT: response.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

const handleGetListMenuChannelByKey = async (req, res) => {
  try {
    if (req.query.keyBox) {
      let keyBox = req.query.keyBox;
      let data = await hotelApiService.handleGetListMenuChannelByKey0(keyBox);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        Player: data.Player,
        DT: data.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server, PCLNCPT",
      EC: "-1",
      DT: "",
    });
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
};
