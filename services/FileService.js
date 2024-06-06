const bcrypt = require('bcrypt');
const BaseService = require('./BaseService');
const tokenService = require('./TokenService');
const { users: userModel, refreshTokens: tokenModel, files: fileModel } = require("../models/index");
const UserDto = require('../dtos/user.dto');
const ApiError = require('../exceptions/apiErrors');
const path = require('path');
const fs = require('fs');

module.exports = class FileService extends BaseService {

    constructor() {
        super();
    }

    async uploadFiles(req, res, next) {
        try {
            if (!req.file) {
                throw ApiError.BadRequest('No file uploaded');
            }
            const { originalname, mimetype, size, filename } = req.file;
            
            const extension = path.extname(originalname);
            const name = file
            console.log(extension);
            console.log(req.file);

            const file = await fileModel.create({
                name: originalname,
                extension,
                mimeType: mimetype,
                size,
                dateOfUpload: new Date(),
            });

            return this.response({
                data: file
            });

        } catch (error) {
            next(error);
        }
    }
}    