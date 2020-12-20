const { Router } = require('express');

const AuthController = require('./authController');

const AuthRouter = Router();

AuthRouter.post(
  '/register',
  AuthController.validateAuth,
  AuthController.registrationController
);

AuthRouter.post(
  '/login',
  AuthController.validateAuth,
  AuthController.loginController
);

AuthRouter.post(
  '/logout',
  AuthController.authorize,
  AuthController.logoutController
);

AuthRouter.get('/verify/:token', AuthController.verify);

module.exports = AuthRouter;
