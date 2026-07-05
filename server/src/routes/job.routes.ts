import { Router } from "express";
import { jobController } from "../controllers/job.controller.js";
import { verifyToken } from "../middleware/auth.js";

export const jobRouter = Router();

jobRouter.get("/id", verifyToken, jobController.getById);
jobRouter.get("/", verifyToken, jobController.list);
jobRouter.post("/", verifyToken, jobController.create);
jobRouter.put("/id", verifyToken, jobController.update);
jobRouter.delete("/id", verifyToken, jobController.remove);