import express from "express";
import config from "./config";
import { initDB } from "./config/db";
import { vehiclesRoute } from "./modules/vechiles/vehicles.route";

const app = express();
const port = config.port;
app.use(express.json());

initDB();

app.use("/api/v1/vehicles", vehiclesRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
