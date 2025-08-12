import { app } from "./app.js";
import { config } from "dotenv";
import { connectDatabase } from "./config/database.js";

config({
  path: "./config/.env",
});

connectDatabase();
app.listen(process.env.PORT, () => {
  console.log("Server is running on http://localhost:" + process.env.PORT);
});
