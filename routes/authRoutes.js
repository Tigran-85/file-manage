// controllers
const AuthController = require('../controllers/AuthController');
const authController = new AuthController();

// validators
const SignInValidation = require('../common/validation/SignInValidation');
const SignUpValidation = require('../common/validation/SignUpValidation');

const { Router } = require('express');
const router = Router();

router.post(
    '/signup',
    SignUpValidation,
    authController
      .signUp.bind(authController)
  );

router.post(
  '/signin',
  SignInValidation,
  authController
    .signIn.bind(authController)
);

module.exports = router;