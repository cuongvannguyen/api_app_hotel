import db from "../models/index";
require("dotenv").config();
const fs = require("fs");
import {
  checkEmailPassword,
  checkPhoneExist,
  hashUserPassword,
  checkPassword,
  checkEmailExist,
} from "./loginRegisterService";
import { verifyToken } from "../middleware/JWTAction";

const checkToken = async (token) => {
  let decode = verifyToken(token);
  if (decode) {
    return {
      EM: "Veryfi token Successfully!",
      EC: 0,
      DT: {
        api_token: token,
      },
    };
  } else {
    return {
      EM: "Veryfi token Fails!",
      EC: 1,
      DT: {},
    };
  }
};

module.exports = {
  checkToken,
};
