import db from "../models/index";
import ms from "ms";
import jwt from "jsonwebtoken";
import { createJWT, verifyToken } from "../middleware/JWTAction";
require("dotenv").config();

const getGroupWithRoles = async (groupId) => {
  //lấy name của group và các role của group đó
  let rolesGroup = await db.GROUP.findOne({
    where: { id: groupId },
    attributes: [],
    include: [
      {
        model: db.ROLE_PERMISSION_APP,
        attributes: ["URL"],
        through: { attributes: [] },
      },
    ],

    // raw: true,
    // nest: true,
  });

  return rolesGroup ? rolesGroup : {};
};

const createRefreshToken = (payload) => {
  let key = process.env.JWT_REFRESH_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key, {
      expiresIn: ms(process.env.JWT_REFRESH_EXPIRE_IN) / 1000,
    });
  } catch (err) {
    console.log(err);
  }
  return token;
};
// decoded token -> payload
const verifyRefreshToken = (token) => {
  let key = process.env.JWT_REFRESH_SECRET;
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (err) {
    console.log(err);
  }
  return decoded;
};

const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.headers.bearer) {
    return req.headers.bearer;
  }

  return null;
};

function convertTimestampToUTCPlus7(timestamp) {
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
}

//api refreshToken
const reFreshToken = (req, res) => {
  try {
    const tokenFromHeader = extractToken(req);
    // lấy cookies từ client

    if (tokenFromHeader) {
      let token = tokenFromHeader;

      let decoded = verifyRefreshToken(token);
      if (decoded) {
        //xoá 2 phần tử iat và exp để tạo ra api_token mới
        const { iat, exp, ...newDecoded } = decoded;

        let api_token_app = createJWT(newDecoded);

        let refresh_token = createRefreshToken(newDecoded);
        let expired_token = convertTimestampToUTCPlus7(
          verifyToken(api_token_app).exp
        );

        return res.status(200).json({
          EC: 0,
          DT: { api_token_app, refresh_token, expired_token },
          EM: "reFresh Token successfully!",
        });
      } else {
        return res.status(200).json({
          EC: 1,
          DT: "",
          EM: "Không tìm thấy refresh_token",
        });
      }
    }
    // end
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server, liên hệ PCLNCPT",
      EC: "-1",
      DT: "",
    });
  }
};

module.exports = {
  getGroupWithRoles,
  createRefreshToken,
  reFreshToken,
};
