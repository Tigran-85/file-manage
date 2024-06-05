const { validationResult } = require("express-validator");

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
          data,
          message,
          validationError
        }
      }
};