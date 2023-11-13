const fs = require('fs')
const readline = require('readline');
import db from "../../models";

let processLineByLine = () => {
  try {
    const filePath = './src/service/manageLog/LogFile.txt'
    // console.log("check Log")
    // fs.watch(filePath, (eventType, filename) => {
    //   console.log("The file ", filename, " was modified!");

    //   // We can look for different types of changes on a file
    //   // using the event type like: rename, change, etc.
    //   console.log("It was a ", eventType, " event type.");
    // });

    fs.watchFile(filePath, {

      // Passing the options parameter
      bigint: false,
      persistent: true,
      interval: 1000,
    }, (curr, prev) => {
      // console.log("\nThe file was edited");

      // Time when file was updated
      // console.log("File was modified at: ", prev.mtime);
      // console.log("File was again modified at: ", curr.mtime);
      // console.log(
      //   "File Content Updated: ",
      //   fs.readFileSync(filePath, "utf8")
      // );
      if (fs.existsSync(filePath)) {
        // const readF = fs.readFileSync(filePath, { encoding: 'utf8' })
        // console.log("check content in file: ", readF)

        const rl = readline.createInterface({
          input: fs.createReadStream(filePath),
          crlfDelay: Infinity
        });

        rl.on('line', async (line) => {

          let lineArr = line.split(" ")
          let useVpn = lineArr[5];
          let stageVpn = `${lineArr[6]} ${lineArr[7]}`
          let statusVpn = lineArr[7] === "in," ? 1 : 0;
          let createDateVpn = `${lineArr[1]} ${lineArr[0]} ${lineArr[2]}`
          await db.LOGGING.create({
            useVpn: useVpn,
            stageVpn: stageVpn,
            statusVpn: statusVpn,
            CreateDate: createDateVpn,
          });

          console.log("line by line: ", line);

        });

        // fs.unlinkSync(filePath);

      } else {
        console.log(`${filePath} not found`)
      }
    });



  } catch (err) {
    console.error(err);

  }
}



module.exports = {
  processLineByLine,

}