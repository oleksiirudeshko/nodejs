const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const SALT = 7;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        const re = /\S+@\S+\.\S+/;
        return re.test(String(value).toLowerCase());
      },
    },
    password: { type: String, required: true },
    subscription: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
    },
    token: { type: String, default: null },
  },
  { versionKey: false }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, bcrypt.genSaltSync(SALT));
  next();
});

class User {
  constructor() {
    this.db = mongoose.model("user", userSchema);
  }

  findByEmail = async (email) => {
    const data = await this.db.findOne({ email: email });
    return data;
  };

  findById = async (id) => {
    return await this.db.findOne({ _id: id });
  };

  createUser = async (data) => {
    const user = new this.db(data);
    return user.save();
  };

  updateToken = async (id, token) => {
    return await this.db.updateOne({ _id: id }, { token });
  };

  login = async (user) => {
    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    await this.updateToken(id, token);
    return token;
  };

  logout = async (userId) => {
    return await this.updateToken(userId, null);
  };
}

module.exports = new User();
