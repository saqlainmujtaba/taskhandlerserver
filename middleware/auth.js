import jwt from "jsonwebtoken";
import User from "../models/users.js";
import { config } from "dotenv";
config({
  path:"./config/.env"
});

export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    // const newTojen = req.body.token;
    const jwtsect = process.env.JWT_SECRET;
    console.log(`this is token inside the auth.js ${token}`);
    if (!token) {
      res.status(401).json({ success: false, message: "Please Login First" });
    }
    console.log(`just before the decoded`);
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const decoded = jwt.verify(token, jwtsect);
    console.log(`this is decoded inside the auth.js ${decoded}`);
    req.user = await User.findById(decoded._id);
    console.log(req.user);
    
    next();
  } catch (error) {
    res.status(500).json({ success: false, errors: error.message });
  }
};
                   