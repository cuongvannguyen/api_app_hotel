import menuAdminService from "../services/menuAdminService";

//create new a group
const handleCreateMenuAdmin = async (req, res) => {
  try {
    let response = await menuAdminService.handleCreateMenuAdmin(req.body);

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch {
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: -1,
      DT: "",
    });
  }
};

const handleCreateMenuAdminItem = async (req, res) => {
  try {
    let response = await menuAdminService.handleCreateMenuAdminItem(req.body);

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch {
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: -1,
      DT: "",
    });
  }
};

const handleReadMenuAdmin = async (req, res) => {
  try {
    let response = await menuAdminService.handleReadMenuAdmin();

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch {
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: -1,
      DT: "",
    });
  }
};

const handleMenuDisplay = async (req, res) => {
  try {
    let response = await menuAdminService.handleMenuDisplay(req.body);

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch {
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: -1,
      DT: "",
    });
  }
};

const handleRealAllMenuAdmin = async (req, res) => {
  try {
    let response = await menuAdminService.handleRealAllMenuAdmin();

    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch {
    return res.status(500).json({
      EM: "Error from server, PCLNCPT",
      EC: -1,
      DT: "",
    });
  }
};

const assignPermissionToRole = async (req, res) => {
  try {
    let data = await permissionService.assignPermissionToRole(req.body);
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

const assignMenuToRole = async (req, res) => {
  try {
    let data = await menuAdminService.assignMenuToRole(req.body);
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

const handleReadPermission = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;
      let data = await sideBarService.getSideBarWithPagination(+page, +limit);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await permissionService.handleReadPermission();
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

const getPermissionByRole = async (req, res) => {
  try {
    let id = req.params.groupId;
    let data = await permissionService.getPermissionByRole(id);
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

const handleGetListMenuByRole = async (req, res) => {
  try {
    let id = req.params.groupId;
    let data = await menuAdminService.handleGetListMenuByRole(id);
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

const handleDeletePermission = async (req, res) => {
  try {
    let response = await permissionService.handleDeletePermission(req.body);
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

const handleDeleteMenuAdmin = async (req, res) => {
  try {
    let response = await menuAdminService.handleDeleteMenuAdmin(req.body);
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

const handleUpdatePermission = async (req, res) => {
  try {
    let data = await permissionService.handleUpdatePermission(req.body);
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

const handleUpdateAdminItem = async (req, res) => {
  try {
    let data = await menuAdminService.handleUpdateAdminItem(req.body);
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
  handleCreateMenuAdmin,
  handleUpdatePermission,
  handleReadPermission,
  handleDeletePermission,
  getPermissionByRole,
  assignPermissionToRole,
  handleReadMenuAdmin,
  handleDeleteMenuAdmin,
  handleCreateMenuAdminItem,
  handleUpdateAdminItem,
  handleRealAllMenuAdmin,
  handleGetListMenuByRole,
  assignMenuToRole,
  handleMenuDisplay,
};
