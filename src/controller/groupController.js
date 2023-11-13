import groupService from "../service/groupService";

//create new a group
const handleCreateGroup = async (req, res) => {
  try {
    let response = await groupService.handleCreateGroup(req.body);
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

const handleDeleteGroup = async (req, res) => {
  try {
    let response = await groupService.handleDeleteGroup(req.body.id);
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

const handleGetAllGroup = async (req, res) => {
  try {
    // console.log(
    //   "check resquest current and pageSize: ",
    //   req.query.current,
    //   req.query.pageSize
    // );
    if (req.query.current && req.query.pageSize) {
      let current = req.query.current;
      let pageSize = req.query.pageSize;
      let data = await groupService.getGroupWithPagination(+current, +pageSize);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await groupService.getAllGroup();
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

const handleBulkGroup = async (req, res) => {
  try {
    let data = await groupService.handleBulkGroup(req.body);

    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
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

const handleUpdateGroup = async (req, res) => {
  try {
    let data = await groupService.handleUpdateGroup(req.body);
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

module.exports = {
  handleCreateGroup,
  handleDeleteGroup,
  handleGetAllGroup,
  handleBulkGroup,
  handleUpdateGroup,
};
