import userApiService from "../service/userApiService";

const checkToken = async (req, res) => {
  try {
    let response = await userApiService.checkToken(req.body.token);
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

module.exports = {
  checkToken,
};
