import db from "../models";
import { handlechangeVPN } from "./manageLog/changePassVPN"
import { processLineByLine } from "../service/manageLog/readLineFromFile"
const getAllLoggin = async () => {
    try {
        let data = await db.LOGGING.findAll({
            order: [["id", "DESC"]],
        });
        return {
            EM: `get all loggin succeeds`,
            EC: 0,
            DT: data,
        };
    } catch (error) {
        console.log(error);
        return {
            EM: "something wrongs with services",
            EC: 1,
            DT: [],
        };
    }
};

const getAllLogginWithPagination = async (page, limit) => {
    try {
        // lấy log quản lý VPN để hiển thị
        // processLineByLine()

        let offset = (page - 1) * limit
        const { count, rows } = await db.LOGGING.findAndCountAll({
            offset: offset,
            limit: limit,
            order: [["CreateDate", "DESC"]],
        })
        let totalPages = Math.ceil(count / limit)
        let data = {
            totalRows: count,
            totalPages: totalPages,
            logginVpn: rows

        }
        return {
            EM: "pagination success VPN Loggin",
            EC: 0,
            DT: data
        }
    } catch (err) {
        console.log(err)
        return {
            EM: "something wrongs with services",
            EC: 1,
            DT: []
        }
    }
}

//Changed Account VPN Mikrotik
const checkUserVpnIsValid = async (userName) => {
    let user = await db.ACCOUNT_VPN.findOne({
        where: { useVpn: userName },
        raw: true
    });

    if (user) {
        return user;
    }
    return null;
};

const changedPassWordVpn = async (data) => {
    let user = await checkUserVpnIsValid(data.userName)
    if (user) {
        // console.log(">>>check user: ", user)
        if (user.passWordOld === data.passWordOld) {
            let processChangePass = handlechangeVPN(data.passWordNew, user.CreateDate)
            if (processChangePass) {

                await db.ACCOUNT_VPN.update(
                    { passWordOld: data.passWordNew },
                    { where: { id: user.id } }
                )

                return {
                    EM: "Channge PassWord Succeed!",
                    EC: 0,
                    DT: []
                }
            } else {
                return {
                    EM: "Cant't connect server VPN to changed Pass.",
                    EC: 1,
                    DT: []
                }
            }

        } else {
            return {
                EM: "Password don't matching, Please Try to again!",
                EC: 1,
                DT: []
            }
        }
    } else {
        return {
            EM: "User isn't valid, Please Try to again!",
            EC: 1,
            DT: []
        }
    }
}

module.exports = {
    getAllLoggin,
    getAllLogginWithPagination,
    changedPassWordVpn
}