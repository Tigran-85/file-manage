const FileService = require("../services/FileService");

class FileController {

  constructor() {
    this.fileService = new FileService()
  }

  async uploadFiles(req, res, next) {
    const data = await this.fileService.uploadFiles(req, res, next);
    if (data) {
      res.status(data.statusCode).json(data);
    }
  }
}

module.exports = FileController;