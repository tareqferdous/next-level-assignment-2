import bcrypt from "bcryptjs";
import express from "express";
import config from "./config";
import { initDB, pool } from "./config/db";
import { authRoute } from "./modules/auth/auth.route";
import { usersRoute } from "./modules/users/users.route";
import { vehiclesRoute } from "./modules/vechiles/vehicles.route";

const secret = "KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";

const app = express();
const port = config.port;
app.use(express.json());

initDB();

app.use("/api/v1/vehicles", vehiclesRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/auth", authRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
