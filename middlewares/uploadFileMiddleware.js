const multer = require("multer");
const { ERROR_MESSAGES } = require("../common/validationMessage");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const allowedFileTypes = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "application/pdf",
];

const fileFilter = (req, file, cb) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    return cb(
      new multer.MulterError(
        ERROR_MESSAGES.INVALID_FILE_FORMAT,
        file,
      ),
      false,
    ); 
  }
};

module.exports = multer({ storage: storage, fileFilter: fileFilter });