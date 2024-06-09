const BaseService = require("./BaseService");
const { files: fileModel } = require("../models/index");
const ApiError = require("../exceptions/apiErrors");
const path = require("path");
const fs = require("fs").promises;
const { RESPONSE_MESSAGES, ERROR_MESSAGES } = require("../common/validationMessage");

module.exports = class FileService extends BaseService {

    constructor() {
        super();
    }

    async uploadFiles(req, res, next) {
        try {
            if (!req.file) {
                throw ApiError.BadRequest(ERROR_MESSAGES.NO_FILE_UPLOADED);
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
                message: RESPONSE_MESSAGES.UPLOADED,
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
            next(error);
        }
    }

    async getFileById(req, res, next) {
        try {
            const { id } = req.params;

            const file = await fileModel.findByPk(id);

            if (!file) {
                throw ApiError.BadRequest(ERROR_MESSAGES.FILE_NOT_FOUND);
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

            if (!file) {
                throw ApiError.BadRequest(ERROR_MESSAGES.FILE_NOT_FOUND);
            }

            const oldFilePath = path.join(__dirname, '../uploads', file.name);

            await fs.unlink(oldFilePath);

            const { originalname, mimetype, size, filename } = req.file;

            const extension = path.extname(originalname);

            // Update the file details in the database
            file.name = filename;
            file.extension = extension;
            file.mimeType = mimetype;
            file.size = size;
            file.dateOfUpload = new Date();

            await file.save();

            return this.response({
                message: RESPONSE_MESSAGES.UPDATED,
                data: {
                    updatedFile: file
                },
            })
            
        } catch (error) {
            await fs.unlink(req.file.path);
            next(error);
        }
    }

    async deleteFile(req, res, next) {
        try {
            const { id } = req.params;

            const file = await fileModel.findByPk(id);

            if (!file) {
                throw ApiError.BadRequest(ERROR_MESSAGES.FILE_NOT_FOUND);
            }

            const filePath = path.join(__dirname, '../uploads', file.name);

            await fs.unlink(filePath);

            await file.destroy();

            return this.response({
                message: RESPONSE_MESSAGES.DELETED,
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
                throw ApiError.BadRequest(ERROR_MESSAGES.FILE_NOT_FOUND);
            }

            const filePath = path.join(__dirname, '../uploads', file.name);

            res.download(filePath, file.name, (err) => {
                if (err) {
                    return res.status(err.status).json({ message: ERROR_MESSAGES.DOWLOAD_FAIL, error: err });
                }
            }); 
        } catch (error) {
            next(error);
        }
    }
}    