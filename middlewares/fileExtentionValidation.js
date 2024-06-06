const multer = require("multer");
const BaseService = require("../services/BaseService");
const baseService = new BaseService();

module.exports = function validateFormat(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json(baseService.serverErrorResponse(err));
  } else if (err) {
    return res.status(400).json(baseService.serverErrorResponse(err));
  }
  next();
};