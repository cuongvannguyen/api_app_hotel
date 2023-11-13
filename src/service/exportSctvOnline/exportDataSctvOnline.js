import mysql from "mysql2/promise";
import bluebird from "bluebird";
const XLSX = require("xlsx");

let testSlectedOTT = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await mysql.createConnection({
        host: "172.29.3.254",
        user: "newstage",
        password: "newstage123#@!",
        database: "cms",
        Promise: bluebird,
      });

      // const connectionDbLog = await mysql.createConnection({
      //   host: "172.29.3.134",
      //   user: "newstage",
      //   password: "newstage123#@!",
      //   database: "cms",
      //   Promise: bluebird,
      // });

      const [ott, fields] = await connection.execute(
        `SELECT DISTINCT M.MEMBER_MOBILE AS "Mobile", M.MEMBER_ID AS "member_id", M.MEMBER_FULLNAME AS "Full Name", M.MEMBER_SCOIN AS "COIN CÒN LẠI", M.BRANCH_ID AS "CHI NHÁNH", GROUP_CONCAT(Q.CONTENT_NAME SEPARATOR ' , ') AS "GÓI CƯỚC ĐÃ ĐĂNG KÝ", GROUP_CONCAT(Q.CONTENT_PRICE SEPARATOR ' k, ') AS "GIÁ TỪNG GÓI", GROUP_CONCAT(Q.CREATE_DATE SEPARATOR ' , ') AS "NGÀY ĐĂNG KÝ GÓI"
        FROM MEMBER_OTT AS M
        JOIN MEMBER_OTT_LOG_TRANS_PRODUCT AS Q ON M.MEMBER_ID = Q.MEMBER_ID 
        WHERE M.MEMBER_SCOIN > 0 AND M.MEMBER_STATUS = 1
        GROUP BY M.MEMBER_ID
        ORDER BY M.MEMBER_ID`
      );

      console.log("check leng: ", ott.length);
      let resultBoxCheck = [];
      for (let i = 0; i < ott.length; i++) {
        if (ott) {
          let ottMember = ott[i];

          let arrResult = {};

          const [ottCheckMobile, mobile] = await connection.execute(
            `SELECT M.MEMBER_MOBILE
          FROM MEMBER_OTT AS M
          WHERE M.MEMBER_SCOIN > 0 AND M.MEMBER_STATUS = 1 AND M.MEMBER_ID = ?
          GROUP BY M.MEMBER_ID`,
            [ottMember.member_id]
          );

          const [ottCheckCoin, coin] = await connection.execute(
            `SELECT M.MEMBER_SCOIN
          FROM MEMBER_OTT AS M
          WHERE M.MEMBER_SCOIN > 0 AND M.MEMBER_STATUS = 1 AND M.MEMBER_ID = ?
          GROUP BY M.MEMBER_ID`,
            [ottMember.member_id]
          );

          const [ottCheckBank, bank] = await connection.execute(
            `SELECT  GROUP_CONCAT(BK.BANK_CODE) AS "THANH TOÁN NGÂN HÀNG VNPAY", GROUP_CONCAT(BK.TRANSACTION_PRICE) AS "SỐ TIỀN NẠP QUA VNPAY", GROUP_CONCAT(BK.CREATE_DATE) AS "LỊCH SỬ NẠP VNPAY"
          FROM MEMBER_OTT AS M
          INNER JOIN MEMBER_TRANSACTION_BANKING AS BK ON M.MEMBER_ID = BK.MEMBER_ID
          WHERE M.MEMBER_SCOIN > 0 AND M.MEMBER_STATUS = 1 AND BK.TRANSACTION_CONFIRM = 1 AND M.MEMBER_ID = ?
          GROUP BY M.MEMBER_ID`,
            [ottMember.member_id]
          );

          const [ottCheckZalo, zalo] = await connection.execute(
            `
          SELECT GROUP_CONCAT(ZP.TRANSACTION_PRICE) AS "SỐ TIỀN NẠP QUA ZALOPAY", GROUP_CONCAT(ZP.CREATE_DATE) AS "LỊCH SỬ NẠP ZALOPAY"
          FROM MEMBER_OTT AS M
          INNER JOIN MEMBER_TRANSACTION_ZALOPAY AS ZP ON M.MEMBER_ID = ZP.MEMBER_ID
          WHERE M.MEMBER_SCOIN > 0 AND M.MEMBER_STATUS = 1 AND ZP.TRANSACTION_CONFIRM = 1 AND M.MEMBER_ID = ?
          GROUP BY M.MEMBER_ID`,
            [ottMember.member_id]
          );

          const [productCheck, product] = await connection.execute(
            `
          SELECT DISTINCT GROUP_CONCAT(MP.EXPIRE_DATE SEPARATOR ' , ') AS "NGÀY HẾT HẠN GÓI ĐÃ MUA", GROUP_CONCAT(P.PRODUCT_NAME SEPARATOR ' , ') AS "TÊN GÓI" 
            FROM MEMBER_OTT AS M
            -- INNER JOIN DEVICE_OTT AS D ON M.MEMBER_ID = D.MEMBER_ID
            INNER JOIN MEMBER_PRODUCT AS MP ON M.MEMBER_ID = MP.MEMBER_ID
            INNER JOIN PRODUCT AS P ON MP.PRODUCT_ID = P.PRODUCT_ID
            -- JOIN MEMBER_TRANSACTION_BANKING AS BK ON M.MEMBER_ID = BK.MEMBER_ID
            -- LEFT JOIN MEMBER_TRANSACTION_ZALOPAY AS ZP ON M.MEMBER_ID = ZP.MEMBER_ID
            -- JOIN MEMBER_TRANSACTION_BANKING AS BK ON M.MEMBER_ID = BK.MEMBER_ID
            -- JOIN MEMBER_TRANSACTION_ZALOPAY AS ZP ON M.MEMBER_ID = ZP.MEMBER_ID
            WHERE M.MEMBER_SCOIN > 0 AND M.MEMBER_STATUS = 1 AND M.MEMBER_ID = ?
            GROUP BY M.MEMBER_ID
            `,
            [ottMember.member_id]
          );

          const [deviceCheck, device] = await connection.execute(
            `
          SELECT DISTINCT GROUP_CONCAT(D.DEVICE_NAME SEPARATOR ' , ') AS "THIẾT BỊ ĐÃ TRUY CẬP", GROUP_CONCAT(D.LAST_LOGIN_IP SEPARATOR ' , ') AS "IP TRUY CẬP"
          FROM MEMBER_OTT AS M

          INNER JOIN DEVICE_OTT AS D ON M.MEMBER_ID = D.MEMBER_ID
          -- INNER JOIN MEMBER_PRODUCT AS MP ON M.MEMBER_ID = MP.MEMBER_ID
          -- INNER JOIN PRODUCT AS P ON MP.PRODUCT_ID = P.PRODUCT_ID
          -- JOIN MEMBER_TRANSACTION_BANKING AS BK ON M.MEMBER_ID = BK.MEMBER_ID
          -- LEFT JOIN MEMBER_TRANSACTION_ZALOPAY AS ZP ON M.MEMBER_ID = ZP.MEMBER_ID
          -- JOIN MEMBER_TRANSACTION_BANKING AS BK ON M.MEMBER_ID = BK.MEMBER_ID
          -- JOIN MEMBER_TRANSACTION_ZALOPAY AS ZP ON M.MEMBER_ID = ZP.MEMBER_ID
          WHERE M.MEMBER_SCOIN > 0 AND M.MEMBER_STATUS = 1 AND M.MEMBER_ID = ?
          GROUP BY M.MEMBER_ID
            `,
            [ottMember.member_id]
          );

          // const [ChannelCheck, channe] = await connectionDbLog.execute(
          //   `
          // SELECT GROUP_CONCAT(L.CONTENT_NAME SEPARATOR ' , ') AS "Channel", GROUP_CONCAT(L.IP_ADDRESS SEPARATOR ' , ') AS "ĐỊA CHỈ TRUY CẬP"
          // FROM CHANNEL_LOG L
          // WHERE L.MEMBER_ID = ?
          // GROUP BY L.MEMBER_ID
          //   `,
          //   [ottMember.member_id]
          // );

          // const [VodCheck, vod] = await connectionDbLog.execute(
          //   `
          // SELECT GROUP_CONCAT(L.CONTENT_NAME SEPARATOR ' , ') AS "vod", GROUP_CONCAT(L.IP_ADDRESS SEPARATOR ' , ') AS "ĐỊA CHỈ TRUY CẬP"
          // FROM CONTENT_LOG L
          // WHERE L.MEMBER_ID = ?
          // GROUP BY L.MEMBER_ID
          //   `,
          //   [ottMember.member_id]
          // );

          if (
            ott &&
            ottCheckMobile &&
            ottCheckCoin &&
            ottCheckBank &&
            ottCheckZalo &&
            productCheck &&
            deviceCheck
            // ChannelCheck &&
            // VodCheck
          ) {
            let checkMobile = ottCheckMobile
              ? JSON.stringify(ottCheckMobile)
              : "";
            let checkCoin = ottCheckCoin ? JSON.stringify(ottCheckCoin) : "";
            let ottMemberCheck = ottMember ? JSON.stringify(ottMember) : "";
            let checkVNPay = ottCheckBank[0]
              ? JSON.stringify(ottCheckBank[0])
              : "";
            let checkZaloPay = ottCheckZalo[0]
              ? JSON.stringify(ottCheckZalo[0])
              : "";
            let checkProduct = productCheck[0]
              ? JSON.stringify(productCheck[0])
              : "";
            let checkDevice = deviceCheck[0]
              ? JSON.stringify(deviceCheck[0])
              : "";
            // let checkChannel = ChannelCheck[0]
            //   ? JSON.stringify(ChannelCheck[0])
            //   : "";
            // let checkVod = VodCheck[0] ? JSON.stringify(VodCheck[0]) : "";
            let result = {
              ...arrResult,
              checkMobile,
              checkCoin,
              ottMemberCheck,
              checkVNPay,
              checkZaloPay,
              checkProduct,
              checkDevice,
              // checkChannel,
              // checkVod,
            };
            // let result = { ...arrResult, checkMobile, checkCoin, ottMemberCheck, checkVNPay, checkZaloPay, checkProduct, checkDevice }
            resultBoxCheck.push(result);
          }
        }
      }

      if (resultBoxCheck) {
        const workBook = XLSX.utils.book_new();
        const workSheet = XLSX.utils.json_to_sheet(resultBoxCheck);
        XLSX.utils.book_append_sheet(workBook, workSheet, "resultBoxCheck");
        XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
        XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
        XLSX.writeFile(workBook, "OTTData.xlsx");
      }

      resolve({
        EM: "Get information ott success!",
        EC: 0,
        DT: "",
      });
    } catch (error) {
      console.log(">>> check error: ", error);
      reject(error);
    }
  });
};

let exportAndroidBox = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await mysql.createConnection({
        host: "172.29.3.254",
        user: "newstage",
        password: "newstage123#@!",
        database: "cms",
        Promise: bluebird,
      });

      const connectionDbLog = await mysql.createConnection({
        host: "172.29.3.134",
        user: "newstage",
        password: "newstage123#@!",
        database: "cms",
        Promise: bluebird,
      });

      const [box, fields] = await connection.execute(
        ` SELECT DISTINCT B.MAC
          FROM ALLOW_MAC_ANDROIDBOX B WHERE B.MAC = "064190617DB7"`
      );

      console.log("check leng: ", box.length, box);

      let resultBoxCheck = [];
      for (let i = 0; i < box.length; i++) {
        if (box) {
          let androidBox = box[i];

          let arrResult = {};

          const [Device, bank] = await connection.execute(
            `SELECT DISTINCT B.MAC, GROUP_CONCAT(D.MEMBER_ID) AS "Mã KH", GROUP_CONCAT(D.LAST_LOGIN_IP SEPARATOR ' , ') AS "IP TRUY CẬP", GROUP_CONCAT(D.LAST_LOGIN_DATE SEPARATOR ' , ') AS "THỜI ĐIỂM TRUY CẬP GẦN NHẤT"
            FROM ALLOW_MAC_ANDROIDBOX B
            INNER JOIN DEVICE_OTT D ON B.MAC = D.MANUFACTURER_ID
            WHERE B.MAC = ?
            GROUP BY B.MAC`,
            [androidBox.MAC]
          );

          console.log("check device Box: ", Device);

          //   const [ottCheckZalo, zalo] = await connection.execute(
          //     `
          //   SELECT GROUP_CONCAT(ZP.TRANSACTION_PRICE) AS "SỐ TIỀN NẠP QUA ZALOPAY", GROUP_CONCAT(ZP.CREATE_DATE) AS "LỊCH SỬ NẠP ZALOPAY"
          //   FROM MEMBER_OTT AS M
          //   INNER JOIN MEMBER_TRANSACTION_ZALOPAY AS ZP ON M.MEMBER_ID = ZP.MEMBER_ID
          //   WHERE M.MEMBER_SCOIN > 0 AND M.MEMBER_STATUS = 1 AND ZP.TRANSACTION_CONFIRM = 1 AND M.MEMBER_ID = ?
          //   GROUP BY M.MEMBER_ID`,
          //     [ottMember.member_id]
          //   );

          //   const [productCheck, product] = await connection.execute(
          //     `
          //   SELECT DISTINCT GROUP_CONCAT(MP.EXPIRE_DATE SEPARATOR ' , ') AS "NGÀY HẾT HẠN GÓI ĐÃ MUA", GROUP_CONCAT(P.PRODUCT_NAME SEPARATOR ' , ') AS "TÊN GÓI"
          //     FROM MEMBER_OTT AS M
          //     -- INNER JOIN DEVICE_OTT AS D ON M.MEMBER_ID = D.MEMBER_ID
          //     INNER JOIN MEMBER_PRODUCT AS MP ON M.MEMBER_ID = MP.MEMBER_ID
          //     INNER JOIN PRODUCT AS P ON MP.PRODUCT_ID = P.PRODUCT_ID
          //     -- JOIN MEMBER_TRANSACTION_BANKING AS BK ON M.MEMBER_ID = BK.MEMBER_ID
          //     -- LEFT JOIN MEMBER_TRANSACTION_ZALOPAY AS ZP ON M.MEMBER_ID = ZP.MEMBER_ID
          //     -- JOIN MEMBER_TRANSACTION_BANKING AS BK ON M.MEMBER_ID = BK.MEMBER_ID
          //     -- JOIN MEMBER_TRANSACTION_ZALOPAY AS ZP ON M.MEMBER_ID = ZP.MEMBER_ID
          //     WHERE M.MEMBER_SCOIN > 0 AND M.MEMBER_STATUS = 1 AND M.MEMBER_ID = ?
          //     GROUP BY M.MEMBER_ID
          //     `,
          //     [ottMember.member_id]
          //   );

          //   const [deviceCheck, device] = await connection.execute(
          //     `
          //   SELECT DISTINCT GROUP_CONCAT(D.DEVICE_NAME SEPARATOR ' , ') AS "THIẾT BỊ ĐÃ TRUY CẬP", GROUP_CONCAT(D.LAST_LOGIN_IP SEPARATOR ' , ') AS "IP TRUY CẬP"
          //   FROM MEMBER_OTT AS M

          //   INNER JOIN DEVICE_OTT AS D ON M.MEMBER_ID = D.MEMBER_ID
          //   -- INNER JOIN MEMBER_PRODUCT AS MP ON M.MEMBER_ID = MP.MEMBER_ID
          //   -- INNER JOIN PRODUCT AS P ON MP.PRODUCT_ID = P.PRODUCT_ID
          //   -- JOIN MEMBER_TRANSACTION_BANKING AS BK ON M.MEMBER_ID = BK.MEMBER_ID
          //   -- LEFT JOIN MEMBER_TRANSACTION_ZALOPAY AS ZP ON M.MEMBER_ID = ZP.MEMBER_ID
          //   -- JOIN MEMBER_TRANSACTION_BANKING AS BK ON M.MEMBER_ID = BK.MEMBER_ID
          //   -- JOIN MEMBER_TRANSACTION_ZALOPAY AS ZP ON M.MEMBER_ID = ZP.MEMBER_ID
          //   WHERE M.MEMBER_SCOIN > 0 AND M.MEMBER_STATUS = 1 AND M.MEMBER_ID = ?
          //   GROUP BY M.MEMBER_ID
          //     `,
          //     [ottMember.member_id]
          //   );

          //   const [ChannelCheck, channe] = await connectionDbLog.execute(
          //     `
          //   SELECT GROUP_CONCAT(L.CONTENT_NAME SEPARATOR ' , ') AS "Channel", GROUP_CONCAT(L.IP_ADDRESS SEPARATOR ' , ') AS "ĐỊA CHỈ TRUY CẬP"
          //   FROM CHANNEL_LOG L
          //   WHERE L.MEMBER_ID = ?
          //   GROUP BY L.MEMBER_ID
          //     `,
          //     [ottMember.member_id]
          //   );

          //   const [VodCheck, vod] = await connectionDbLog.execute(
          //     `
          //   SELECT GROUP_CONCAT(L.CONTENT_NAME SEPARATOR ' , ') AS "vod", GROUP_CONCAT(L.IP_ADDRESS SEPARATOR ' , ') AS "ĐỊA CHỈ TRUY CẬP"
          //   FROM CONTENT_LOG L
          //   WHERE L.MEMBER_ID = ?
          //   GROUP BY L.MEMBER_ID
          //     `,
          //     [ottMember.member_id]
          //   );
          //   if (ott && ottCheckBank && ottCheckZalo && productCheck && deviceCheck && ChannelCheck && VodCheck) {
          //     let ottMemberCheck = ottMember ? JSON.stringify(ottMember) : ""
          //     let checkVNPay = ottCheckBank[0] ? JSON.stringify(ottCheckBank[0]) : ""
          //     let checkZaloPay = ottCheckZalo[0] ? JSON.stringify(ottCheckZalo[0]) : ""
          //     let checkProduct = productCheck[0] ? JSON.stringify(productCheck[0]) : ""
          //     let checkDevice = deviceCheck[0] ? JSON.stringify(deviceCheck[0]) : ""
          //     let checkChannel = ChannelCheck[0] ? JSON.stringify(ChannelCheck[0]) : ""
          //     let checkVod = VodCheck[0] ? JSON.stringify(VodCheck[0]) : ""
          //     let result = { ...arrResult, ottMemberCheck, checkVNPay, checkZaloPay, checkProduct, checkDevice, checkChannel, checkVod }
          //     resultBoxCheck.push(result)

          //   }
        }
      }

      // if (resultBoxCheck) {
      //   const workBook = XLSX.utils.book_new()
      //   const workSheet = XLSX.utils.json_to_sheet(resultBoxCheck)
      //   XLSX.utils.book_append_sheet(workBook, workSheet, "resultBoxCheck")
      //   XLSX.write(workBook, { bookType: 'xlsx', type: 'buffer' })
      //   XLSX.write(workBook, { bookType: 'xlsx', type: "binary" })
      //   XLSX.writeFile(workBook, "OTTData.xlsx")
      // }

      resolve({
        EM: "Get information ott success!",
        EC: 0,
        DT: "",
      });
    } catch (error) {
      console.log(">>> check error: ", error);
      reject(error);
    }
  });
};

module.exports = {
  testSlectedOTT,
  exportAndroidBox,
};
