import { app } from "./app.js";
import { config } from "dotenv";
import { connectDatabase } from "./config/database.js";
// import cloudinary from "cloudinary/v2"
// Require the cloudinary library
// const cloudinary = require("cloudinary").v2;
import { v2 as cloudinary } from 'cloudinary';

config({
  path: "./config/.env",
});
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// });

// Return "https" URLs by setting secure: true
cloudinary.config({
      secure: true
    });
    
    // Log the configuration
    console.log(cloudinary.config());

connectDatabase();
app.listen(process.env.PORT, () => {
  console.log("Server is running on http://localhost:" + process.env.PORT);
});
