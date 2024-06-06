// controllers
const AuthController = require("../controllers/AuthController");
const authController = new AuthController();

// validators
const SignInValidation = require("../common/validation/SignInValidation");
const SignUpValidation = require("../common/validation/SignUpValidation");

const authMiddleware = require("../middlewares/authMiddleware");

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

router.get(
    '/logout',
    authController
      .logout.bind(authController)
);

router.post(
    '/signin/new_token',
    authController
      .refresh.bind(authController)
);

router.get(
    '/info',
    authMiddleware,
    authController
      .userInfo.bind(authController)
);

module.exports = router;