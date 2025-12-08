import express from "express";
import config from "./config";
import { initDB } from "./config/db";
import { authRoute } from "./modules/auth/auth.route";
import { bookingsRouter } from "./modules/bookings/bookings.route";
import { usersRoute } from "./modules/users/users.route";
import { vehiclesRoute } from "./modules/vechiles/vehicles.route";

const app = express();
const port = config.port;
app.use(express.json());

initDB();

app.use("/api/v1/vehicles", vehiclesRoute);
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/bookings", bookingsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
