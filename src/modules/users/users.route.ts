import { Router } from "express";
import { usersController } from "./users.controller";

const router = Router();
router.get("/", usersController.getAllUsers);
router.put("/:userId", usersController.updateUser);
router.delete("/:userId", usersController.deleteUser);

export const usersRoute = router;
