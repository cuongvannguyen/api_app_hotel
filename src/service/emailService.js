require("dotenv").config;
// import { reject } from "lodash";
import nodemailer from "nodemailer";
import moment from "moment";
import "moment/locale/vi";

let sendSimpleEmail = async (
  data,
  userTest,
  urlTest,
  filePDF,
  fileName,
  peopleTestparam
) => {
  // console.log("check File PDF: ", filePDF);
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Hệ Thống Kiểm Tra Đề Nghị Test - PCLNCPT" <nguyencuong210997@gmail.com>`, // sender address
    to: getUserTest(userTest).toString(),
    cc: "tannguyen1123@gmail.com, thang.nh@sctv.vn, loc.tt@sctv.vn, huyen.ntn@sctv.vn, nghiencuuphattrien@sctv.vn",
    subject: `Đề Nghị Kiểm Tra ${data.typeTest}`, // Subject line
    html: `
        <h3>Kính gửi: Bộ phận kiểm tra P.CL-NC-PT</h3>
        <p>P. Chiến lược - Nghiên cứu - Phát triển đã nhận được yêu cầu từ <b>Phòng KHDT</b> để kiểm tra ${data.typeTest
      } của gói thầu/gói mua sắm: ${data.packageTest} 
        <hr>
        <p> Thông tin chi tiết của Đề Nghị Kiểm tra: </p>
        <p>- <b>Ngày nhận đề nghị kiểm tra: ${changeDateTest(
        data.dateRegister
      )}</b></p>
        <p>- <b>Loại đề nghị: ${data.typeTest}</b></p>
        <p>- <b>Gói thầu/ gói mua sắm: </b> ${data.packageTest}</p>
        <p>- <b>Hợp đồng số: </b> ${data.contractNo}</p>
        <p>- <b>Nhà cung cấp: </b> ${data.vendor}</p>
        <p>- <b>Đơn vị kiểm tra: </b> ${peopleTestparam}</p>
        <p>- <b>Thông tin liên hệ nhận hàng: </b>: ${data.localtion} - ${data.contact
      }</p>
        <p>- <b>Thời gian cần kiểm tra và trả báo cáo:</b>  ${changeDateTest(
        data.timerTest
      )}</b></p>
        <hr>
        <p> Vui lòng kiểm tra các thông tin trên, liên hệ bộ phận liên quan lấy mẫu hàng test và click vào đường link bên dưới để xác nhận việc kiểm tra trên đây: </p>
        <div><a href="${urlTest}" target="_blank">Xác nhận ở đây</a></div>
        <p></p>
        <div>Trân trọng!</div>
        <div></div>
        <div>Strategy Research & Development department
        Saigontourist Cable Television (SCTV Co.LTD</div>
    `,
    attachments: [
      {
        filename: fileName,
        path: filePDF,
        contentType: "application/pdf",
      },
    ],
    // html body
    // html: getBodyHTMLEmail(dataSend),
  });
};

let getUserTest = (userTest) => {
  // console.log("check arr data: ", userTest);
  if (userTest) {
    var emailTest = [];
    for (let i = 0; i < userTest.length; i++) {
      for (let j = 0; j < userTest[i].length; j++) {
        if (userTest[i][j].email) {
          emailTest.push(userTest[i][j].email);
        }
      }
    }
    return emailTest;
  }
};

let changeDateTest = (date) => {
  let dateFormate = moment(date).utc(7).format("DD/MM/YYYY");
  return dateFormate;
};

module.exports = {
  sendSimpleEmail,
  // sendAttachment,
};
