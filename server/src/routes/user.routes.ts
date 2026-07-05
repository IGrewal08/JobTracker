import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.js";

export const userRouter = Router();

userRouter.get("/", verifyToken, userController.getName);
userRouter.patch("/", verifyToken, userController.update);
userRouter.delete("/", verifyToken, userController.remove);