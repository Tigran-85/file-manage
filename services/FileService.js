const bcrypt = require('bcrypt');
const BaseService = require('./BaseService');
const tokenService = require('./TokenService');
const { users: userModel, refreshTokens: tokenModel, files: fileModel } = require("../models/index");
const UserDto = require('../dtos/user.dto');
const ApiError = require('../exceptions/apiErrors');
const path = require('path');
const fs = require('fs').promises;

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

            const file = await fileModel.create({
                name: filename,
                extension,
                mimeType: mimetype,
                size
            });

            return this.response({
                message: "Uploaded successfully",
                data: file
            });

        } catch (error) {
            next(error);
        }
    }

    async getFiles(req, res, next) {
        try {
            const { list_size, page } = req.query;
            const listSize = +list_size || +process.env.PAGE_SIZE;
            const pageFiles = +page || +process.env.PER_PAGE;
            const offset = (pageFiles - 1) * listSize;

            const { count, rows } = await fileModel.findAndCountAll({
                limit: listSize,
                offset: offset
            });

            const totalPages = Math.ceil(count / listSize);

            return this.response({
                data: {
                    files: rows,
                    totalItems: count,
                    totalPages: totalPages,
                    currentPage: pageFiles,
                },

            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async getFileById(req, res, next) {
        try {
            const { id } = req.params;

            const file = await fileModel.findByPk(id);

            if (!file) {
                throw ApiError.BadRequest("File does not found");
            }

            return this.response({
                data: {
                    file
                },
            })
        } catch (error) {
            next(error);
        }
    }

    async updateFile(req, res, next) {
        try {
            const { id } = req.params;

            const file = await fileModel.findByPk(id);
            const oldFilePath = path.join(__dirname, '../uploads', file.name);
            const newFilePath = path.join(__dirname, '../uploads', req.body.name);

            if (!file) {
                throw ApiError.BadRequest("File does not found");
            }

            const updatedFile = await file.update(req.body);
            
            console.log('oldFilePath', oldFilePath);
            console.log('newFilePath', newFilePath);
            // console.log(file);
            await fs.rename(oldFilePath, newFilePath);

            return this.response({
                message: "Updated successfully",
                data: {
                    updatedFile: updatedFile
                },
            })
            
        } catch (error) {
            next(error);
        }
    }

    async deleteFile(req, res, next) {
        try {
            const { id } = req.params;

            const file = await fileModel.findByPk(id);

            if (!file) {
                throw ApiError.BadRequest("File does not found");
            }

           await fs.unlink(`uploads\\${file.name}`);

            await file.destroy();

            return this.response({
                message: "Deleted successfully",
                data: {
                    file
                },
            })
        } catch (error) {
            next(error);
        }
    }

    async downloadFile(req, res, next) {
        try {
            const { id } = req.params;

            const file = await fileModel.findByPk(id);

            if (!file) {
                throw ApiError.BadRequest("File does not found");
            }

            const filePath = path.join(__dirname, '../uploads', file.name);

            res.download(filePath, file.name, (err) => {
                if (err) {
                    return res.status(err.status).json({ message: 'Failed to download file', error: err });
                }
            }); 
        } catch (error) {
            next(error);
        }
    }
}    