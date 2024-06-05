const bcrypt = require('bcrypt');
const BaseService = require('./BaseService');
const tokenService = require('./TokenService');
const { users: userModel } = require("../models/index");
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
            })
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async signIn(req) {
        try {
            const err = this.handleErrors(req);
            if (err.hasErrors) {
                return err.body;
            }

            const { username, password } = req.body;


            const user = await userModel.findOne({
                where: { username }
            })

            if (user && bcrypt.compareSync(password, user.password)) {
                const token = createToken({
                    payload: {
                        username
                    },
                    secret: process.env.JWT_SECRET,
                    options: {
                        expiresIn: process.env.JWT_EXPIRED
                    }
                });

                return this.response({
                    data: {
                        token,
                        id: user.id,
                        user: user.userName
                    }
                });
            }

            return this.response({
                statusCode: 400,
                status: false,
                message: 'Incorrect username and/or password'
            });

        } catch (error) {
            return this.serverErrorResponse(error);
        }
    }


};