const jwt = require("jsonwebtoken");
const { refreshTokens: tokenModel, BlacklistedToken: blacklistedModel } = require("../models/index");

class TokenService {
    createToken(payload, secret, expiresIn) {
        return jwt.sign(payload, secret, { expiresIn });
    }

    generateTokens(payload){
        const accessToken = this.createToken(payload, process.env.JWT_ACCESS_TOKEN, process.env.JWT_ACCESS_EXPIRED);
        const refreshToken = this.createToken(payload, process.env.JWT_REFRESH_TOKEN, process.env.JWT_REFRESH_EXPIRED);

        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({
            where: {
                user: userId
            }
        });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create({ user: userId, refreshToken });

        return token;
    }

    validateToken(token, secret) {
        try {
            const userData = jwt.verify(token, secret);
            return userData;
        } catch (error) {
            return null;
        }
    }

    async findToken(token) {
        const tokenData = await tokenModel.findOne({
            where: {
                refreshtoken: token
            }
        });
        return tokenData;
    }

    async addTokenToBlacklist(token) {
        const decoded = jwt.decode(token);
        const expiry = new Date(decoded.exp * 1000);

        const tokenData = await blacklistedModel.create({
            token,
            expiry
        });
    }
    
}

module.exports = new TokenService();    