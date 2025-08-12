import express from "express";
import {
  addTask,
  forgetPassword,
  getMyProfile,
  login,
  logout,
  register,
  removeTask,
  resetPassword,
  updatePassword,
  updateProfile,
  updateTask,
  verify,
} from "../controller/User.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.route("/register").post(register); 
router.route("/login").post(login);

router.route("/verifyFirst").post(isAuthenticated, verify);

router.route("/me").get(isAuthenticated, getMyProfile);
router.route("/logout").get(logout);

router.route("/addtask").post(isAuthenticated, addTask);
router
  .route("/task/:taskId")  
  .get(isAuthenticated, updateTask)
  .delete(isAuthenticated, removeTask);


router.route("/updateprofile").put(isAuthenticated, updateProfile);
router.route("/updatepassword").put(isAuthenticated, updatePassword);

router.route("/forgetpassword").post(forgetPassword);
router.route("/resetpassword").put(resetPassword);

export default router;
