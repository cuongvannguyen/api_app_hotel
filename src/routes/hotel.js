import express from "express";
const router = express.Router();
import apiController from "../controller/apiController";
import userController from "../controller/userController";
import hotelController from "../controller/hotelController";
import { checkUserJWT, checkUserPerMission } from "../middleware/JWTAction";
import JWTService from "../service/JWTService";
import sideBarController from "../controller/sideBarController";

/**
 *
 * @param {*} app express app
 */
const initApiHotelRoutes = (app) => {
  //rest api check JWT role and permission
  router.all("*", checkUserJWT, checkUserPerMission);
  router.get("/refresh-token", JWTService.reFreshToken);
  router.post("/check-token", userController.checkToken);
  //Start API Hotel
  //1. Auth
  router.post("/auth/app", apiController.handleLogin);
  // Start Manage Sidebar
  router.get("/sidebar/get-all-sidebar", sideBarController.handleGetAllSideBar);
  // End Manage Sidebar

  // Start Manage Channel OTT App
  router.get(
    "/manageChannel/get-category-via-channel",
    hotelController.handleGetCategoryViaChannel
  );
  router.get(
    "/manageChannel/get-all-list-channel",
    hotelController.handleGetAllListChannel
  );
  //End OTT APP

  //Start IPTV APP
  router.get("/channel/getChannelByKey", hotelController.handleGetChannelByKey);
  router.get(
    "/channel/getChannelListMenuByKey",
    hotelController.handleGetListMenuChannelByKey
  );
  //End IPTV APP

  router.get("/weather/:cityName", hotelController.getWeatherData);
  // End Manage Channel

  // Start Manage Room
  router.get("/room/get-information-room", hotelController.handleGetRoomHotel);
  // End Manage Rooms

  router.get("/get-list-sidebar", hotelController.handleGetListSidebar);
  // End Manage Rooms

  router.get("/listService", hotelController.handleGetListServiceHotel);
  router.get("/listMenu", hotelController.handleGetListMenuHotel);
  router.get("/listExplore", hotelController.handleGetListExploreHotel);
  router.get("/listGuide", hotelController.handleGetListGuideHotel);
  router.get("/inforApp", hotelController.handleGetInforApp);

  return app.use("/api/v1", router);
};

export default initApiHotelRoutes;
