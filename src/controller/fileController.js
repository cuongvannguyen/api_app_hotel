const fs = require("fs");
import fileService from "../service/fileService";
const handleSaveFile = async (req, res) => {
  try {
    // console.log("check request Body: ", req.body);
    let response = await fileService.handleSaveFileTest(req.body, req.files);
    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch {
    return res.status(200).json({
      EM: "Error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const handleSaveFileAttachment = async (req, res) => {
  try {
    let response = await fileService.handleSaveFileAttachment(
      req.body,
      req.files
    );
    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch {
    return res.status(200).json({
      EM: "Error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const handleSaveFileReport = async (req, res) => {
  try {
    let response = await fileService.handleSaveFileReport(req.body, req.files);
    return res.status(200).json({
      EM: response.EM,
      EC: response.EC,
      DT: response.DT,
    });
  } catch {
    return res.status(200).json({
      EM: "Error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const getFile = async (req, res) => {
  try {
    let filePath = req.query.path;

    if (fs.existsSync(filePath)) {

      var file = fs.createReadStream(filePath);
      var stat = fs.statSync(filePath);
      res.setHeader("Content-Length", stat.size);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=quote.pdf");
      file.pipe(res);

    } else {
      console.log(`${filePath} not found`)
      return res.status(200).json({
        EM: "Error from server",
        EC: 1,
        DT: "`${filePath} not found`",
      });
    }


    // return res.status(200).json({
    //     EM: "upload File Success",
    //     EC: 0,
    //     DT: "",
    // });
    // var data = fs.readFileSync(filePath);
    // res.contentType("application/pdf");
    // res.send(data);
  } catch {
    return res.status(200).json({
      EM: "Error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const readFiles = async (req, res) => {
  try {
    if (req.query.page && req.query.limit && req.query.userId) {
      let page = req.query.page;
      let limit = req.query.limit;
      let user = req.query.userId;
      let data = await fileService.getFilesWithPagination(+page, +limit, user);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await fileService.getAllFiles();
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const getProfileTest = async (req, res) => {
  try {
    if (req.query.id) {
      let data = await fileService.getProfileTest(req.query.id);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const getDetailTest = async (req, res) => {
  try {
    if (req.query.id) {
      let data = await fileService.getDetailTest(req.query.id);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const deleteRegisterTest = async (req, res) => {
  try {
    let data = await fileService.deleteRegisterTest(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const postVerifyTest = async (req, res) => {
  try {
    if (req.body.token && req.body.userTest) {
      let infor = await fileService.postVerifyUserTest(req.body);
      return res.status(200).json({
        EM: infor.EM,
        EC: infor.EC,
        DT: infor.DT,
      });
    } else {
      let infor = await fileService.postVerifyTest(req.body);
      return res.status(200).json({
        EM: infor.EM,
        EC: infor.EC,
        DT: infor.DT,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const getDepartmentTest = async (req, res) => {
  try {
    let infor = await fileService.getDepartmentTest();
    return res.status(200).json({
      EM: infor.EM,
      EC: infor.EC,
      DT: infor.DT,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const downloadFile = async (req, res) => {
  try {
    // let infor = await fileService.downloadFile(req);
    let filePath = req.query.path;

    if (fs.existsSync(filePath)) {
      return res.download(filePath);
    } else {
      console.log(`${filePath} not found`)
      return res.status(200).json({
        EM: "Error from server",
        EC: 1,
        DT: "`${filePath} not found`",
      });
    }


  } catch (e) {
    console.log(e);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
}

module.exports = {
  handleSaveFile,
  getFile,
  readFiles,
  getProfileTest,
  getDetailTest,
  deleteRegisterTest,
  postVerifyTest,
  handleSaveFileAttachment,
  handleSaveFileReport,
  getDepartmentTest,
  downloadFile
};
