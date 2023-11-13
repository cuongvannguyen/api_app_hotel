const exec = require('ssh-exec')
const fs = require('fs')
const readline = require('readline');
const events = require('events');
const lineReader = require('line-reader')

const changePassVpn = async (userName, passwordVpn, passwordNew) => {
    try {
        const filePath = './src/service/manageLog/PassFile.txt'
        let writeFile = () => {
            return new Promise(async (resolve, reject) => {
                try {
                    exec('/ppp secret print', {
                        user: 'admin',
                        host: '112.197.10.222',
                        password: 'Sctv@123'
                    }, function (err, stdout, stderr) {
                        fs.writeFileSync(filePath, stdout)
                        resolve(true);
                    })
                } catch (e) {
                    reject(e);
                }
            });
        };

        let handlechangeVPN = (passwordNew, position) => {
            return new Promise(async (resolve, reject) => {
                try {
                    exec(`/ppp secret set password=${passwordNew} ${position}`, {
                        user: 'admin',
                        host: '112.197.10.222',
                        password: 'Sctv@123'
                    }, function (err, stdout, stderr) {
                        if (err) {
                            resolve(false)
                        } else {
                            console.log("stdout is: ", stdout)
                            resolve(false)
                        }

                    })
                } catch (e) {
                    reject(e);
                }
            });
        }

        let handleCheckChange = (userName, passwordVpn, passwordNew) => {
            return new Promise(async (resolve, reject) => {
                try {
                    let result = await writeFile();
                    if (result) {
                        // const rl = readline.createInterface({
                        //     input: fs.createReadStream(filePath),
                        //     crlfDelay: Infinity
                        // });

                        // const readStream = fs.createReadStream(filePath);

                        // const rl = readline.createInterface({
                        //     input: readStream
                        // });

                        // rl.on('line', async (line) => {
                        //     let lineArr = line.split(" ")
                        //     let user = line.search(userName)
                        //     let password = line.search(passwordVpn)
                        //     console.log(">>> check line", lineArr, user, password)
                        //     if (user > 0 && password > 0) {
                        //         let position = lineArr[1];
                        //         let changedVpn = await handlechangeVPN(passwordNew, position)
                        //         console.log("kiem tra user, pass", changedVpn)
                        //         if (changedVpn) {
                        //             rl.close();
                        //             readStream.destroy();
                        //             resolve(
                        //                 {
                        //                     EM: "Changed Pass succeed!",
                        //                     EC: 0,
                        //                     DT: "",
                        //                 }
                        //             )


                        //         }
                        //     }

                        //     if (lineArr.length <= 1) {

                        //         resolve(

                        //             {
                        //                 EM: "Changed Pass fail!",
                        //                 EC: 1,
                        //                 DT: "",
                        //             }
                        //         )

                        //     }
                        // });

                        lineReader.eachLine(filePath, async (line, last) => {
                            console.log(line)
                            let lineArr = line.split(" ")
                            let user = line.search(userName)
                            let password = line.search(passwordVpn)
                            // console.log(">>> check line", lineArr, user, password)
                            if (user > 0 && password > 0) {
                                let position = lineArr[1];
                                console.log(">>>chekc position: ", position)
                                let data = await handlechangeVPN(passwordNew, position)
                                return data
                            }
                        })
                    }

                } catch (e) {
                    reject(e);
                }
            });
        }

        if (fs.existsSync(filePath)) {

            let data = await handleCheckChange(userName, passwordVpn, passwordNew)
            console.log(">>>check Data: ", data)

        } else {
            console.log(`${filePath} not found`)
        }

    } catch (err) {
        console.error(err);
    }

};

const handlechangeVPN = (passwordNew, position) => {
    return new Promise(async (resolve, reject) => {
        try {
            exec(`/ppp secret set password=${passwordNew} ${position}`, {
                user: 'admin',
                host: '112.197.10.222',
                password: 'Sctv@123'
            }, function (err, stdout, stderr) {
                if (err) {
                    resolve(false)
                } else {
                    resolve(true)
                }

            })
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    changePassVpn,
    handlechangeVPN
}