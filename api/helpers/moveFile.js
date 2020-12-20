const path = require("path");
const fs = require("fs-extra");
require("dotenv").config();

const IMG_DIR = path.join(process.cwd(), "public", "images", "/");

const moveFile = async (req, res, next) => {
  if (req.file) {
    console.log("start move");
    console.log(req.file);
    await fs.move(
      req.file.path,
      path.join(IMG_DIR, req.file.filename),
      function (err) {
        if (err) return console.error(err);
        console.log("Successfully moved");
      }
    );
  }
  res.status(200).send(`'photoUrl: localhost:3000/images/${req.file.filename}`);
};

module.exports = moveFile;
