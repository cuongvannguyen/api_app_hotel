let multer = require("multer");

const imgFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("image/png") ||
    file.mimetype.includes("image/jpeg") ||
    file.mimetype.includes("image/svg+xml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only image/png - jpeg file or svg file", true);
  }
};

const storageLogoChannel = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/storage/avartars");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    const name = Buffer.from(uniqueSuffix, "latin1").toString("utf8");
    cb(null, name);
  },
});

var uploadLogoChannel = multer({
  storage: storageLogoChannel,
  fileFilter: imgFilter,
});

module.exports = { uploadLogoChannel };
