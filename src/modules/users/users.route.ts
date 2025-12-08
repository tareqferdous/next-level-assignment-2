import { Router } from "express";
import auth from "../../middleware/auth";
import { Roles } from "../auth/auth.constant";
import { usersController } from "./users.controller";

const router = Router();
router.get("/", auth(Roles.admin), usersController.getAllUsers);
router.put("/:userId", usersController.updateUser);
router.delete("/:userId", usersController.deleteUser);

export const usersRoute = router;
