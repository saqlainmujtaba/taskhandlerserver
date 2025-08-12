import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "dotenv";

config({
  path: "./config/.env",
});
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password Must be 8 characters"],
    select: false,
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tasks: [
    {
      title: "String",
      description: "String",
      completed: Boolean,
      createdAt: Date,
    },
  ],
  // tasks: [
  //   {
  //     title: {
  //       type: String,
  //       required: true,
  //     },
  //     description: {
  //       type: String,
  //       required: true,
  //     },
  //     completed: {
  //       type: Boolean,
  //       required: true,
  //     },
  //     createdAt: {
  //       type: Date,
  //       default: Date.now,
  //     },
  //   },
  // ],

  verefied: {
    type: Boolean,
    default: false,
  },
  otp: Number,
  otp_expiry: Date,
  resetPasswordOtp: Number,
  resetPasswordOtpExpiry: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

// just for practice
// console.log(`jwt secret ${process.env.JWT_SECRET} and this jwt cookie expire ${ process.env.JWT_COOKIE_EXPIRE}`);
// console.log(process.env.JWT_SECRET);
userSchema.methods.getJWTToken = function () {
  console.log(
    `jwt secret ${process.env.JWT_SECRET} and this jwt cookie expire ${process.env.JWT_COOKIE_EXPIRE}`
  );
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
  });
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.index({ otp_expiry: 1 }, { expireAfterSeconds: 10 });

const User = mongoose.model("User", userSchema);
export default User;
