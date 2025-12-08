import { Request, Response } from "express";
import { usersService } from "./users.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersService.getAllUsersFromDB();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const isAllowedToUpdate =
    req.user?.email === req.body.email || req.user?.role === "admin";

  try {
    if (!isAllowedToUpdate) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this user",
      });
    }

    const result = await usersService.updateUserInDB(
      userId as string,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const result = await usersService.deleteUserFromDB(userId as string);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const usersController = {
  getAllUsers,
  updateUser,
  deleteUser,
};
