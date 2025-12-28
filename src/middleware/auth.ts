import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../config/db";

const auth = (...roles: ("admin" | "customer")[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const secret = config.jwtSecret!;
      if (!secret) throw new Error("JWT secret not configured");

      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized",
        });
      }

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized",
        });
      }
      const decoded = jwt.verify(token, secret) as JwtPayload;
      const user = await pool.query(
        `
      SELECT * FROM users WHERE email=$1
      `,
        [decoded.email]
      );
      if (user.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized",
        });
      }
      next();
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || "Unauthorized",
      });
    }
  };
};

export default auth;
