const ApiError = require("../exceptions/apiErrors");
const multer = require("multer");
const { ERROR_MESSAGES } = require("../common/validationMessage");

module.exports = function(err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            message: err.message,
            errors: err.errors
         })
    }

    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            message: err.message ? err.message : err.code
         })
    }

    return res.status(500).json({ message: ERROR_MESSAGES.SERVER_ERROR});
}