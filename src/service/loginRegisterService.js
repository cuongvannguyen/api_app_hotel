import db from "../models";
require("dotenv").config();
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
//create a new JWT and store localtorage
import { getGroupWithRoles } from "./JWTService";
import { createJWT, verifyToken } from "../middleware/JWTAction";
import { createRefreshToken } from "./JWTService";

const checkPassword = (inputPassword, hashPassword) => {
  return bcrypt.compareSync(inputPassword, hashPassword);
};

const convertTimestampToUTCPlus7 = (timestamp) => {
  const date = new Date(timestamp * 1000); // Convert seconds to milliseconds

  // Thêm 7 giờ vào giá trị giờ của đối tượng Date
  date.setHours(date.getHours());

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");

  // Format lại thành định dạng "YYYY-MM-DDTHH:MM:SS.sssZ"
  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  return formattedDate;
};

const handleUserLogin = async (rawData, parseIp) => {
  try {
    if (
      !rawData ||
      !rawData.valueLogin ||
      !rawData.password ||
      !rawData.keyBox
    ) {
      return {
        EM: "!Paramester is not null",
        EC: 1,
        DT: "",
      };
    } else {
      let user = await db.USER.findOne({
        where: {
          [Op.or]: [
            { EMAIL: rawData.valueLogin },
            { USER_PHONE: rawData.valueLogin },
          ],
        },
        // raw: true,
      });

      let macDevice = await db.DEVICE_MEMBER.findOne({
        where: {
          [Op.or]: [
            { MAC_DEVICE: rawData.keyBox.toUpperCase() },
            { SSID: rawData.keyBox },
          ],
        },
      });

      if (!user) {
        return {
          EM: "Account không tồn tại hoặc không tìm thấy!",
          EC: 1,
          DT: "",
        };
      }
      if (!macDevice) {
        return {
          EM: "Mac/Key Box không tồn tại hoặc không tìm thấy!",
          EC: 1,
          DT: "",
        };
      }

      if (user && user.USER_STATUS === 1 && macDevice) {
        let isCorrectPassword = checkPassword(rawData.password, user.PASSWORD);

        if (isCorrectPassword) {
          let groupWithRoles = await getGroupWithRoles(23);
          let payload = {
            ROLE_PERMISSION_APPs: groupWithRoles.ROLE_PERMISSION_APPs,
          };
          let api_token_app = createJWT(payload);
          let expired_token = convertTimestampToUTCPlus7(
            verifyToken(api_token_app).exp
          );

          let refresh_token = createRefreshToken(payload);
          return {
            EM: "Get Token App Success!",
            EC: 0,
            DT: {
              api_token_app,
              refresh_token,
              expired_token: expired_token,
              keyBox: rawData.keyBox,
            },
          };
        }
      }
    }
  } catch (e) {
    console.log(e);
    return {
      EM: "Something wrongs is service...",
      EC: -2,
    };
  }
};

module.exports = {
  handleUserLogin,
};
