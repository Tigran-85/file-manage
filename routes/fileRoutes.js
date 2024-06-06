// controllers
const FileController = require("../controllers/FileController");
const fileController = new FileController();

const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadFileMiddleware");

const { Router } = require('express');
const router = Router();

router.post(
    '/upload',
    upload.single("file"),
    fileController
      .uploadFiles.bind(fileController)
);

module.exports = router;