import User from "../models/users.js";
import { sendMail } from "../utils/sendMail.js";
import { sendToken } from "../utils/sendToken.js";
import cloudinary from "cloudinary";
import fs from "fs";

export const register = async (req, res) => {
  try {
    const { name, email, password,avatar } = req.body;
    console.log(name);
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const minutes = process.env.OTP_EXPIRE;
    const otp = Math.floor(Math.random() * 1000000);
    const otp_expiry = new Date(
      Date.now() + minutes * 60 * 1000
    );
    console.log(`otp is ${otp} and otp expired at ${otp_expiry}`);
    user = await User.create({
      name,
      email,
      password,
      avatar,
      otp,
      otp_expiry,
    });
    console.log(`user created`);
    await sendMail(email, "Verify Your Account", `Your OTP is ${otp} , This will expire in ${minutes} minutes`);
    sendToken(
      res,
      user,
      201,
      "OTP send to your email, please verify your Account"
    );
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const verify = async (req, res) => {
  try {
    const otp = Number(req.body.otp);
    const otp_expiry = new Date(
      Date.now() + process.env.OTP_EXPIRE * 60 * 1000
    );
    console.log(otp);
    const user = await User.findById(req.user._id);
    console.log(`otp ${otp}  otpexpiry ${otp_expiry}`);
    if (user.otp != otp || otp_expiry < Date.now()) {
      return res
        .status(400)
        .json({ success: false, messge: "Invalid OTP or has been expired" });
    }

    user.verefied = true;
    user.otp = null;
    user.otp_expiry = null;
    await user.save();
    sendToken(res, user, 200, "Account Verified");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, messgae: "invalid passowrd" });
    }
    sendToken(res, user, 200, "Login Successfully");
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .json({ success: true, message: "logout Succeful" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const addTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    const user = await User.findById(req.user._id);

    user.tasks.push({
      title,
      description,
      completed: false,
      createdAt: new Date(Date.now()),
    });

    await user.save();

    res.status(200).json({ success: true, message: "Task added Succefully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const removeTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const user = await User.findById(req.user._id);
    user.tasks = user.tasks.filter(
      (task) => task._id.toString() !== taskId.toString()
    );
    await user.save();

    res.status(200).json({ success: true, message: "Task removed Succefully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const user = await User.findById(req.user._id);
    user.tasks = user.tasks.find(
      (task) => task._id.toString() === taskId.toString()
    );

    user.tasks.completed = !user.tasks.completed;

    await user.save();
    res.status(200).json({ success: true, message: "Task updated Succefully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    sendToken(res, user, 201, `Welcome Back ${user.name.toLocaleUpperCase()} `);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name } = req.body;
    // const {avatar } = req.files;

    if (name) user.name = name;

    await user.save();
    if (avatar) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      const mycloud = cloudinary.v2.uploader.upload(avatar);

      fs.rmSync("./tmp", { recursive: true });
      user.avatar = {
        public_id: (await mycloud).public_id,
        url: (await mycloud).secure_url,
      };
    }
    await user.save();
    res.status(200).json({
      success: true,
      message: `Profile Updated Succefully yeh cheese`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("password");
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res
        .status(409)
        .json({ success: false, message: "Please enter all fields" });
    }
    // const {avatar } = req.files;

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res
        .status(403)
        .json({ success: false, message: "Old Password does not match" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(406).json({
        success: false,
        message: "Confirm password should be same as New password",
      });
    }

    user.password = newPassword;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: `Password Updated Succefully` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }

    const otp = Math.floor(Math.random() * 1000000);

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes for reset password expiry

    await user.save();

    const message = `Your OTP for reseting the password ${otp}. If you did not request for this, please ignore this email.`;

    await sendMail(email, "Request for Reseting Password", message);

    res.status(200).json({ success: true, message: `OTP sent to ${email}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { otp, newPassword, confirmNewPassword } = req.body;

    const user = await User.findOne({
      resetPasswordOtp: otp,
      resetPasswordOtpExpiry: { $gt: Date.now() },
    }).select("+password");
    console.log(`user from reset password ${user}`);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Otp Invalid or has been Expired" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: "Confirm Password should be as new password",
      });
    }

    user.password = newPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordExpiry = null;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: `Password Changed Successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
