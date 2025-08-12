import jwt from "jsonwebtoken";
import User from "../models/users.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
//     const newToken = req.body.token;
    const jwtSecret = process.env.JWT_SECRET;
    console.log(`this is token inside the auth.js ${token}`);
    
    if ( !token ) {
      return res.status(401).json({ success: false, message: "Please Login First" });
    }
    
    // Choose which token to verify based on the priority
//     const tokenToVerify = newToken || token;

    // Decode the token (without verification) to access its claims, including 'exp'
    const decodedToken = jwt.decode(token);

    if (decodedToken && Date.now() >= decodedToken.exp * 1000) {
      // Token has expired
      return res.status(401).json({ success: false, message: "Token has expired" });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, jwtSecret);
    console.log(`this is decoded inside the auth.js ${decoded}`);
    
    req.user = await User.findById(decoded._id);
    next();
  } catch (error) {
    res.status(500).json({ success: false, errors: error.message });
  }
};
