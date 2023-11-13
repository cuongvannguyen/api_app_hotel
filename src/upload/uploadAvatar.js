let multer = require("multer");

const imgFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("image/png") ||
    file.mimetype.includes("image/jpeg")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only image/png or jpeg file", true);
  }
};

const storageAvartar = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/storage/avartars");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    const name = Buffer.from(uniqueSuffix, "latin1").toString("utf8");
    cb(null, name);
  },
});

const storageIcon = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/storage/avartars");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    const name = Buffer.from(uniqueSuffix, "latin1").toString("utf8");
    cb(null, name);
  },
});

var uploadAvatar = multer({ storage: storageAvartar, fileFilter: imgFilter });
var uploadIcon = multer({ storage: storageIcon, fileFilter: imgFilter });

module.exports = { uploadAvatar, uploadIcon };
