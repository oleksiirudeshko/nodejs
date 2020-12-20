const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const upload = require("./helpers/multer");

const contactRouter = require("./contacts/contactRouters");
const authRouter = require("./auth/authRouters");
const usersRouter = require("./auth/usersRouter");
const moveFileToPublic = require("./helpers/moveFile");

module.exports = class ContactServer {
  constructor() {
    this.server = null;
  }

  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.post();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    const accessLogStream = fs.createWriteStream(
      path.join(__dirname, "access.log"),
      { flags: "a" }
    );
    this.server.use(morgan("combined", { stream: accessLogStream }));
    this.server.use(express.json());
    this.server.use(cors({ origin: "http://localhost:3000" }));
    this.server.use(express.static("public"));
    this.server.use(express.static("tmp"));
  }

  initRoutes() {
    this.server.use("/contacts", contactRouter);
    this.server.use("/auth", authRouter);
    this.server.use("/users", usersRouter);
  }

  post() {
    this.server.post("/form-data", upload.single("avatar"), moveFileToPublic);
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log(`start listening on port ${process.env.PORT}`);
    });
  }
};
