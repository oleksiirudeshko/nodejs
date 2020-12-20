const { Router } = require('express');
const upload = require('../helpers/multer.js');
const moveFileToPublic = require('../helpers/moveFile');

const AuthController = require('./authController');

const UserRouter = Router();

UserRouter.get(
  '/current',
  AuthController.authorize,
  AuthController.getUserController
);

UserRouter.patch(
  '/avatar',
  upload.single('avatar'),
  AuthController.authorize,
  moveFileToPublic,
  AuthController.updateUser
);

module.exports = UserRouter;
