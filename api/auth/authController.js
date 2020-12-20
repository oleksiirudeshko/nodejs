const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const UsersModel = require("./userModel");
const emailService = require("../helpers/emailService");
const { UnauthorizedError } = require("../helpers/errors.constructor");
const ServEmail = new emailService();

class AuthController {
  getUserController = async (req, res, next) => {
    const user = req.user;
    const { email, password, subscription, token } = user;
    const userForResponse = { email, subscription };
    return res.status(200).json(userForResponse);
  };

  updateUser = async (req, res, next) => {
    try {
      console.log(req.body);
      const { _id, ...data } = req.body;
      const avatarPath = req.file.path;

      const updatedUser = await UsersModel.updateUser(_id, data);
      res.status(200).json(`'avatarUrl:' ${avatarPath}`);
    } catch (e) {
      next(e);
    }
  };

  registrationController = async (req, res, next) => {
    const verifyToken = uuidv4();
    const { email, name } = req.body;
    try {
      await ServEmail.sendEmail(verifyToken, email, name);
    } catch (e) {
      console.log(e);
      return res.status(503).send("Service is unavailable");
    }
    try {
      const user = await UsersModel.findByEmail(email);
      if (user) {
        return res.status(409).send("'message': 'Email in use'");
      }
      const newUser = await UsersModel.createUser({ ...req.body, verifyToken });
      res.status(201).json(newUser);
    } catch (e) {
      next(e);
    }
  };

  loginController = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await UsersModel.findByEmail(email);
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!user || !isPasswordValid) {
        return res.status(401).send("Email or password is wrong");
      }
      if (!user.verify) {
        return res.status(401).send("Email address is not verified");
      }

      const token = await UsersModel.login(user);
      res.status(200).json(`token: ${token}, user: ${user}`);
    } catch (e) {
      next(e);
    }
  };

  logoutController = async (req, res, next) => {
    try {
      const user = req.user;

      await UsersModel.logout(user._id);
      res.status(204).send("No Content");
    } catch (e) {
      next(e);
    }
  };

  authorize = async (req, res, next) => {
    try {
      const authorizationHeader = req.get("Authorization") || "";
      const token = authorizationHeader.replace("Bearer ", "");
      let userId;

      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET_KEY).id;
      } catch (e) {
        console.log("error", e);
        next(res.status(401).json({ message: "Not authorized" }));
      }

      const user = await UsersModel.findById(userId);
      if (!user || user.token !== token) {
        throw new UnauthorizedError("Not authorized");
      }
      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      next(err);
    }
  };

  verify = async (req, res, next) => {
    const token = req.params.token;

    try {
      const user = await UsersModel.findByField({ verifyToken: token });

      if (user) {
        const UserId = user._id;
        await UsersModel.updateUser(UserId, {
          verify: true,
          verifyToken: null,
        });
        return res.status(200).json("Ok");
      }
      console.log("User not found");
      res.status(404).json({ message: "User not found" });
    } catch (e) {
      next(e);
    }
  };

  validateAuth = (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validationRes = schema.validate(req.body);

    if (validationRes.error) {
      return res
        .status(400)
        .send("missing required name field", validationRes.error);
    }
    next();
  };
}

module.exports = new AuthController();
