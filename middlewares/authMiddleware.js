const ApiError = require("../exceptions/apiErrors");
const tokenService = require("../services/TokenService");
const { BlacklistedToken: blacklistedModel } = require("../models/index");
const { ERROR_MESSAGES } = require("../common/validationMessage");

module.exports = async function(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const blacklistedToken = await blacklistedModel.findOne({ where: { token: accessToken } });
        if (blacklistedToken) {
          return res.status(403).json({ message: ERROR_MESSAGES.INVALID_TOKEN });
        }

        const userData = tokenService.validateToken(accessToken, process.env.JWT_ACCESS_TOKEN);

        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }
        
        req.user = userData;
        next();
    } catch (error) {
        return next(ApiError.UnauthorizedError());
    }
}