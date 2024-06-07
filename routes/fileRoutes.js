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

router.get(
    '/list',
    fileController
      .getFiles.bind(fileController)
);

router.get(
    '/:id',
    fileController
      .getFileById.bind(fileController)
);

router.put(
    '/update/:id',
    fileController
      .updateFile.bind(fileController)
);

router.delete(
    '/delete/:id',
    fileController
      .deleteFile.bind(fileController)
);

router.get(
    '/download/:id',
    fileController
      .downloadFile.bind(fileController)
);

module.exports = router;