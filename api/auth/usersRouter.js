const { Router } = require("express");

const AuthController = require("./authController");

const UserRouter = Router();

UserRouter.get(
  "/current",
  AuthController.authorize,
  AuthController.getUserController
);

module.exports = UserRouter;
