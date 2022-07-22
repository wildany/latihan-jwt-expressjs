import express from "express";
import db from "./config/database.js";
import router from "./route/routes.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();

try {
    await db.authenticate();
    console.log("Database connected...");

} catch (error) {
    console.error(error);
}

app.use(express.json());
app.use(router);

app.listen(3000, () => {
    console.info(`server running at port 3000`);
})