const bcrypt = require("bcrypt");
const BaseService = require("./BaseService");
const tokenService = require("./TokenService");
const { users: userModel, refreshTokens: tokenModel } = require("../models/index");
const UserDto = require("../dtos/user.dto");
const ApiError = require("../exceptions/apiErrors");
const { VALIDATION_ERROR_MESSAGES, RESPONSE_MESSAGES, ERROR_MESSAGES } = require("../common/validationMessage");

module.exports = class AuthService extends BaseService {

    constructor() {
        super();
    }

    async signUp(req, res, next) {
        try {
            const { email, password } = req.body;

            const err = this.handleErrors(req);
            if (err.hasErrors) {
                return next(ApiError.BadRequest(VALIDATION_ERROR_MESSAGES.VALIDATION_ERROR, err.body))
            }

            const userExists = await userModel.findOne({
                where: { email }
            });

            if (userExists) {
                throw ApiError.BadRequest(ERROR_MESSAGES.USER_EXIST);
            }

            const hashPassword = await bcrypt.hash(password, +process.env.SALT);

            const user = await userModel.create({
                email,
                password: hashPassword
            });

            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens({ ...userDto });
            await tokenService.saveToken(userDto.id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

            return this.response({
                data: {
                    ...tokens,
                    user: userDto
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async login(email, password) {

        const user = await userModel.findOne({
            where: { email }
        });

        if (!user) {
            throw ApiError.BadRequest(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        const isPassEquals = await bcrypt.compare(password, user.password);

        if (!user || !isPassEquals) {
            throw ApiError.BadRequest(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: UserDto }
    }

    async signIn(req, res, next) {
        try {
            const err = this.handleErrors(req);
            if (err.hasErrors) {
                return err.body;
            }

            const { email, password } = req.body;

            const userData = await this.login(email, password);

            res.cookie('refreshToken', userData.refreshToken, { maxAge: process.env.REFRESH_TOKEN_MAX_AGE, httpOnly: true });

            return this.response({
                data: {
                    ...userData
                }
            })
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            if (refreshToken) {
                await tokenModel.destroy({
                    where: {
                        refreshToken
                    }
                });
            }

            res.clearCookie('refreshToken');

            const authHeader = req.headers['authorization'];
            if (authHeader) {
                const token = authHeader && authHeader.split(' ')[1];
                await tokenService.addTokenToBlacklist(token);
            }
            
            return this.response({
                message: RESPONSE_MESSAGES.SIGN_OUT
            });
        } catch (error) {
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;

            if (!refreshToken) {
                throw ApiError.UnauthorizedError();
            }

            const userData = tokenService.validateToken(refreshToken, process.env.JWT_REFRESH_TOKEN);
            const tokenFromDb = await tokenService.findToken(refreshToken);
            if (!userData || !tokenFromDb) {
                throw ApiError.UnauthorizedError();
            }

            const user = await userModel.findByPk(userData.id);
            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens({ ...userDto });
            await tokenService.saveToken(userDto.id, tokens.refreshToken);

            res.cookie('refreshToken', tokens.refreshToken, { maxAge: process.env.REFRESH_TOKEN_MAX_AGE, httpOnly: true });

            return this.response({
                data: {
                    ...tokens,
                    user: UserDto
                }
            })
        } catch (error) {
            next(error);
        }
    }

    async userInfo(req, res, next) {
        try {
            if (!req.user) {
                throw ApiError.UnauthorizedError();
            }
            return this.response({
                data: {
                    user: req.user.id
                }
            })
        } catch (error) {
            next(error);
        }
    }


};