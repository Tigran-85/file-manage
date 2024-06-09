const { body } = require("express-validator");
const { VALIDATION_ERROR_MESSAGES } = require("../validationMessage");

module.exports = [
  body("email").trim().isEmail().withMessage(VALIDATION_ERROR_MESSAGES.EMAIL),

  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage(VALIDATION_ERROR_MESSAGES.min(5)),
];