const multer = require("multer");

const multerStorage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //   cb(null, "uploads/");
    // },
    // filename: (req, file, cb) => {
    //   cb(null, Date.now()+file.originalname);
    // },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Not a image file!!"), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    transforms: () =>
      sharp().resize(250, 250).jpeg({
        progressive: true,
        quality: 80,
    }),
});

module.exports = upload;

