//test api
import loginRegisterService from "../service/loginRegisterService";
require("dotenv").config();
// Handel User Login CMS hotel
const handleLogin = async (req, res) => {
  try {
    // const path = req.path;
    // console.log(`Đã gọi đường dẫn URL: ${path}`);

    const parseIp = (req) =>
      req.headers["x-forwarded-for"]?.split(",").shift() ||
      req.socket?.remoteAddress;
    let data = await loginRegisterService.handleUserLogin(
      req.body,
      parseIp(req)
    );
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      EM: "error from server, liên hệ P CLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

module.exports = {
  handleLogin,
};
