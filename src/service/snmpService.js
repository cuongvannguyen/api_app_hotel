import bcrypt from "bcryptjs";
import { reject } from "lodash";
import db from "../models/index";
const salt = bcrypt.genSaltSync(10);

import snmp from "net-snmp"

//get all oid 

//Save configure snmp by oid 
let checkDevice = (ip_address) => {
  return new Promise(async (resolve, reject) => {
    try {
      let device = await db.DEVICE.findOne({
        raw: true,
        where: { ip_address: ip_address },
      });
      if (device) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getIdDevice = (ip_address) => {
  return new Promise(async (resolve, reject) => {
    try {
      let device = await db.DEVICE.findOne({
        raw: true,
        where: { ip_address: ip_address },
      })
      if (device) {
        resolve(device.id)
      }
      else {
        resolve(false)
      }
    } catch (e) {
      reject(e)
    }
  })
}

let checkOid = (oid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let oidDevice = await db.OID.findOne({
        raw: true,
        where: { oid_url: oid },
        include:[
          {model: db.DEVICE,
          attributes:['ip_address', 'community_string']}
        ], 
        nest: true
      })
      if (oidDevice) {
        resolve(oidDevice)
      }
      else {
        console.log("Oid not found!")
      }
    } catch (e) {
      reject(e)
    }
  })
}

let createConfigureSnmp = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check device is exist?
      let check = await checkDevice(data.ipDevice);
      if (false) {
        resolve({
          errCode: 1,
          errMessage:
            "Your Device is already to used, please try another Device.",
        });

      } else {      
        if(!data.ipDevice || !data.communityString || !data.communityVersion || !data){
          resolve({
            errCode: 2,
            errMessage:
              "missing input param!",
          });
          
        }else{
          let idDevice = await getIdDevice(data.ipDevice)
          if(!idDevice){
            await db.DEVICE.create({
              ip_address: data.ipDevice,
              community_string: data.communityString,
              community_version: data.communityVersion,
            });
          }

          if (!data.serviceList) {
            resolve({
              errCode: 1,
              errMessage: "Missing required param!",
            })
          } else {
            let idDevice = await getIdDevice(data.ipDevice)
            if (data.serviceList && data.serviceList.length > 0) {
              data.serviceList = data.serviceList.map((item) => {
                item.device_id = idDevice;
                return item
              })
            }
            // console.log("Result Data ServiceList: ", data.serviceList)
            await db.OID.bulkCreate(data.serviceList)
  
          }
          resolve({
            errCode: 0,
            message: "Add Device Success!",
          });

        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getValueOid = async (data) => {
  // console.log("data: ", data);
  return new Promise(async (resolve, reject) => {
    try {  
      let checkOID = await checkOid(data);  
      if (checkOID) {
        // console.log("check OID: ", checkOID,"check ip device", checkOID.DEVICE.ip_address, "check community: ", checkOID.DEVICE.community_string, "checkOid",checkOID.oid_key )
        let session = snmp.createSession(checkOID.DEVICE.ip_address, checkOID.DEVICE.community_string);
        let oids = [checkOID.oid_key];
        // console.log("check array oid: ", oids)

        let valueOid = ""
        session.get(oids, function (error, varbinds) {
          if (error) {
            console.error(error);
          } else {
            for (var i = 0; i < varbinds.length; i++) {
              if (snmp.isVarbindError(varbinds[i])) {
                // console.error(snmp.varbindError(varbinds[i]));
              } else {
                // console.log(varbinds[i].oid, " = ", varbinds[i].value);
                let buf = varbinds[i].value
                let result = buf.toString()
                valueOid = result
              }
            }
          }
          session.close();

          if(valueOid){
            resolve({
              errCode: 0,
              errmessage: "Get Value OID Success!",
              data: valueOid
            })
          }else{
            resolve({
              errCode: -1,
              errmessage: "Get Value OID Fail!",
              data: []
            })
          }
          
        });
      }

    } catch (e) {
      reject(e)
    }
  })
}

let getAllOid = (data)=>{
  return new Promise(async(resolve,reject)=>{
    try{
      let arrOid = "";
      if (!data || !data.ipSearch){
        resolve({
          errCode: 2,
          errMessage:
            "missing input param!",
        });
      }
      else {
        let device_id_search = await getIdDevice(data.ipSearch);
        if(device_id_search){
          arrOid = await db.OID.findAll({
            raw: true,
            where: {device_id: device_id_search}
          })
        }
        // console.log("get all OID: ", arrOid)
        resolve(
          resolve({
            errCode: 0,
            errmessage: "Get All oid Success!",
            data: arrOid
          })
        );
      }
    }catch(e){
      reject(e)
    }
  })
}

let handleDeleteOidSnmp = (data) =>{
  return new Promise(async(resolve, reject)=> {
    try{
    let oidDevice = await db.OID.findOne({
      where: {id: data},
      draw: true
    })

    if (!oidDevice) {
      resolve({
        errCode: 2,
        errMessage: `The oid isn't exit`,
      });
    }
    // await user.destroy();
    await db.OID.destroy({
      where: { id: data },
    });
    resolve({
      errCode: 0,
      errMessage: `The OID is delete`,
    });

    }catch(e){
      console.log(e)
      reject(e)
    }
  })
} 


module.exports = {
  createConfigureSnmp,
  getValueOid,
  getAllOid,
  handleDeleteOidSnmp
};
