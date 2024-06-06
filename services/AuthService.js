const bcrypt = require('bcrypt');
const BaseService = require('./BaseService');
const tokenService = require('./TokenService');
const { users: userModel, refreshTokens: tokenModel } = require("../models/index");
const UserDto = require('../dtos/user.dto');
const ApiError = require('../exceptions/apiErrors');

module.exports = class AuthService extends BaseService {

    constructor() {
        super();
    }

    async signUp(req, res, next) {
        try {
            const { email, password } = req.body;

            const err = this.handleErrors(req);
            if (err.hasErrors) {
                return next(ApiError.BadRequest("Validation Error", err.body))
            }

            const userExists = await userModel.findOne({
                where: { email }
            });

            if (userExists) {
                throw ApiError.BadRequest(`User ${userExists.email} already registered`);
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
            console.log(error);
            next(error);
        }
    }

    async login(email, password) {

        const user = await userModel.findOne({
            where: { email }
        });

        const isPassEquals = await bcrypt.compare(password, user.password);

        if (!user || !isPassEquals) {
            throw ApiError.BadRequest('Incorrect email and/or password');
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

            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

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

            return this.response({
                message: 'logout successfully'
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

            res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

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