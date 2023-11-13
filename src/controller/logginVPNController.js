
import logginVpnService from "../service/logginVpnService"

const handleLoginVPN = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page
      let limit = req.query.limit
      let data = await logginVpnService.getAllLogginWithPagination(+page, +limit)

      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT
      })
    } else {
      let data = await logginVpnService.getAllLoggin();
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }

  } catch (e) {
    console.log(e);
    return res.status(200).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};

const handleChangedVpn = async (req, res) => {
  try {
    if (!req.body.userName || !req.body.passWordOld || !req.body.passWordNew) {
      return res.status(200).json({
        EM: "Missing required parameters",
        EC: "1",
        DT: "",
      });
    } else {
      let response = await logginVpnService.changedPassWordVpn(req.body)
      return res.status(200).json({
        EM: response.EM,
        EC: response.EC,
        DT: response.DT
      });
    }
  } catch {
    return res.status(200).json({
      EM: "Error from server",
      EC: "-1",
      DT: "",
    });
  }
}


module.exports = {
  handleLoginVPN,
  handleChangedVpn
}