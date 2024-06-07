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

  async getFiles(req, res, next) {
    const data = await this.fileService.getFiles(req, res, next);
    if (data) {
      res.status(data.statusCode).json(data);
    }
  }

  async getFileById(req, res, next) {
    const data = await this.fileService.getFileById(req, res, next);
    if (data) {
      res.status(data.statusCode).json(data);
    }
  }

  async updateFile(req, res, next) {
    const data = await this.fileService.updateFile(req, res, next);
    if (data) {
      res.status(data.statusCode).json(data);
    }
  }

  async deleteFile(req, res, next) {
    const data = await this.fileService.deleteFile(req, res, next);
    if (data) {
      res.status(data.statusCode).json(data);
    }
  }

  async downloadFile(req, res, next) {
    const data = await this.fileService.downloadFile(req, res, next);
    if (data) {
      res.status(data.statusCode).json(data);
    }
  }
}

module.exports = FileController;