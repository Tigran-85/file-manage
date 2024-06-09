const { body } = require("express-validator");

const { VALIDATION_ERROR_MESSAGES } = require("../validationMessage");

module.exports = [
  body("email").trim().isEmail().withMessage(VALIDATION_ERROR_MESSAGES.EMAIL),

  body("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage(VALIDATION_ERROR_MESSAGES.REQUIRED)
    .matches(/^(?=(.*?[A-Z]){3,}).{3,}$/)
    .withMessage("Min 3 uppercase letter")
    .matches(/^(?=(.*[a-z]){3,}).{3,}$/)
    .withMessage("Min 3 lowercase letter")
    .matches(/^(?=(.*[\d]){2,}).{2,}$/)
    .withMessage("Min 2 numbers")
    .matches(/^(?=(.*[\W]){2,}).{2,}$/)
    .withMessage("Min 2 special character"),
];