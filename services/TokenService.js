const jwt = require("jsonwebtoken");
const { refreshTokens: tokenModel } = require("../models/index");
const { accept } = require("../common/validationMessage");

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
}

module.exports = new TokenService();    