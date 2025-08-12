import express, { json } from "express";
// we importing router as User because it is exporting as default
import User from "./routers/User.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
  })
);
// app.use(cors());
app.use(cors({
  origin: [
    'http://localhost:19006',
    'exp://192.168.10.20:19000',
    'exp://192.168.10.20:8081'
  ],
  credentials: true,
  exposedHeaders: ['set-cookie']
}));

app.use("/api/v1", User);

app.get("/", (req, res) => {
  res.send("Server is working");
});

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(
//   fileUpload({
//     limits: { fileSize: 50 * 1024 * 1024 },
//     useTempFiles: true,
//   })
// );

// app.use("/api/v1", User);
// // here  "/api/v1" is the prefix to every route
