const ApiError = require('../exceptions/apiErrors');
const BaseService = require("../services/BaseService");
const baseService = new BaseService();
const multer = require("multer");

module.exports = function(err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            message: err.message,
            errors: err.errors
         })
    }

    if (err instanceof multer.MulterError) {
        return res.status(400).json(baseService.serverErrorResponse(err));
      } else if (err) {
        console.log(err);

        return res.status(400).json(baseService.serverErrorResponse(err));
      }

    return res.status(500).json({ message: "Internal Server Error" })
}