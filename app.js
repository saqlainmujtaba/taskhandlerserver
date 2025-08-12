import express, { json } from "express";
// we importing router as User because it is exporting as default
import User from "./routers/User.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
app.use(
  cors({
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

app.use("/api/v1", User);

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/index.html"));
  // res.send("Server is working");
});

