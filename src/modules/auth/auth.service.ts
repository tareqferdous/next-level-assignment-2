import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../config/db";

const secret = config.jwtSecret!;

const loginUserIntoDB = async (email: string, password: string) => {
  const user = await pool.query(
    `SELECT id, name, email, password, role FROM users WHERE email=$1`,
    [email]
  );

  if (!user.rows.length) {
    const error: any = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }
  const matchedPassword = await bcrypt.compare(password, user.rows[0].password);

  if (!matchedPassword) {
    const error: any = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }
  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const token = jwt.sign(jwtPayload, secret, { expiresIn: "1d" });

  const { password: _, ...userWithoutPassword } = user.rows[0];
  return { token, user: userWithoutPassword };
};

const registerUserInDB = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  if (!name || !email || !password || !phone) {
    const error: any = new Error(
      "Name, email, password, and phone are required"
    );
    error.statusCode = 400;
    throw error;
  }

  // email validation
  if ((email as string) !== (email as string).toLowerCase()) {
    const error: any = new Error("Email must be in lowercase");
    error.statusCode = 400;
    throw error;
  }

  //  Password validation
  if ((password as string).length < 6) {
    const error: any = new Error("Password must be at least 6 characters long");
    error.statusCode = 400;
    throw error;
  }

  //role validation
  const allowedRoles = ["admin", "customer"];

  const normalizedRole = (role as string)?.toLowerCase() || "customer";

  if (!allowedRoles.includes(normalizedRole)) {
    const error: any = new Error("Invalid role");
    error.statusCode = 400;
    throw error;
  }

  const hashPassword = await bcrypt.hash(password as string, 10);

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone, role`,
      [name, email, hashPassword, phone, normalizedRole]
    );
    return result.rows[0];
  } catch (error: any) {
    if (error.code === "23505") {
      const err: any = new Error("Email already exists");
      err.statusCode = 409;
      throw err;
    }
    throw error;
  }
};

export const authServices = {
  loginUserIntoDB,
  registerUserInDB,
};
