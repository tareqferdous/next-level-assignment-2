import express, { Request, Response } from "express";
import { Pool } from "pg";
import config from "./config";

const app = express();
const port = config.port;
app.use(express.json());

const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

app.post("/api/v1/vehicles", (req: Request, res: Response) => {
  const body = req.body;
  console.log(body);
});

app.get("/", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ message: "Server is running in root", path: req.path });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
