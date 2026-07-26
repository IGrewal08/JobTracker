import { preferencesController } from "../controllers/preferencesController.js";
import { verifyToken } from "../middleware/auth.js";
import { Router } from "express";

export const preferencesRouter = Router();

preferencesRouter.get("/", verifyToken, preferencesController.get);
preferencesRouter.post("/", verifyToken, preferencesController.upsert);