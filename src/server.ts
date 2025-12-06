import express from "express";
import config from "./config";
import { initDB, pool } from "./config/db";
import { usersRoute } from "./modules/users/users.route";
import { vehiclesRoute } from "./modules/vechiles/vehicles.route";

const app = express();
const port = config.port;
app.use(express.json());

initDB();

app.use("/api/v1/vehicles", vehiclesRoute);
app.use("/api/v1/users", usersRoute);

app.use("/api/v1/auth/signup", async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, password, phone, role]
    );
    delete result.rows[0].password;
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
