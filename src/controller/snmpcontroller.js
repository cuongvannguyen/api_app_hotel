import db from "../models/index";
import snmpService from "../service/snmpService"

let hanleCreatConfigureSnmp = async(req, res)=>{
  
  let message = await snmpService.createConfigureSnmp(req.body)
  return res.status(200).json(message);
}

let handleGetValueOid = async (req, res)=>{
  let bridge = "/"
  let name = req.params.name;
  let id = req.params.id
  let url_test = bridge.concat(name,bridge,id)
  // console.log("Url is: ", url_test)
  let data = await snmpService.getValueOid(url_test)
  return res.status(200).json({
    data
  });
}

let hadleGetAllOid = async(req, res)=>{
  try{
    let data = await snmpService.getAllOid(req.body);
    return res.status(200).json(data);
  }catch(e){
    console.log("Get all oid error: ", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
}


let handleDeleteOid = async(req,res)=>{
  if (!req.body) {
    return res.status(200).json({
      errCode: 1,
      errMessage: "Missing required parameters!",
    });
  }
    let message = await snmpService.handleDeleteOidSnmp(req.body.id)
    return res.status(200).json(message);
}

// handleAllChannel
let handleAllChannel = async(req, res)=>{
  try{
    let data = await snmpService.handleAllChannel(req.body);
    return res.status(200).json(data);
  }catch(e){
    console.log("Get all channel error: ", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
}
//handleOneChannel
let handleOneChannel = async(req, res)=>{
  try{
    let data = await snmpService.handleOneChannel(req.body);
    return res.status(200).json(data);
  }catch(e){
    console.log("Get all channel error: ", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
}

module.exports = {
  hanleCreatConfigureSnmp,
  handleGetValueOid,
  hadleGetAllOid,
  handleDeleteOid,
  handleAllChannel,
  handleOneChannel
};
