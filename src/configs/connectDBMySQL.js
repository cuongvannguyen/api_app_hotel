import mysql from "mysql2/promise";
import bluebird from "bluebird";

let connectDBMySQL = async () => {
  try {
    const connection = await mysql.createConnection({
      host: "172.29.2.91",
      user: "newstage",
      password: "newstage123#@!",
      database: "HOTEL_DB",
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
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = connectDBMySQL;
