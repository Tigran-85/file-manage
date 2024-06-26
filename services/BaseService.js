const { validationResult } = require("express-validator");
const { ERROR_MESSAGES } = require("../common/validationMessage");

module.exports = class BaseService {

  constructor() {
  }

  handleErrors(request) {
    const { errors } = validationResult(request);

    return {
      hasErrors: errors && errors.length,
      ...(errors && errors.length ? {
        body: {
          success: false,
          statusCode: 400,
          validationError: {
            property: errors[0].param,
            message: errors[0].msg,
          }
        }
      } : {})
    }
  }

      response({
          status = true,
          statusCode = 200,
          data = {},
          message = "",
          validationError = {}
        }) {
        return {
          status,
          statusCode,
          message,
          data,
          validationError
        }
      }

  serverErrorResponse(error) {
    return {
      status: false,
      statusCode: 500,
      data: error,
      message: ERROR_MESSAGES.SERVER_ERROR,
      validationError: {}
    }
  }
};