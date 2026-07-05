import type { AuthReq } from "../middleware/auth.js";
import { userServices } from "../services/user.services.js";
import type { NextFunction, Response } from "express";

export const userController = {

    getName: async (req: AuthReq<{ id: string, name: string }, any>, res: Response, next: NextFunction) => {
        try {
            const userName = req.user?.name;
            if (!userName) return res.status(401).json({ message: "Unauthorized." });
            return res.status(200).json(userName);
        } catch (err) {
            next(err);
        }
    },

    update: async (req: AuthReq<{ id: string }, any>, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: "Unauthorized" });

            const userName: string = req.body;
            if (!userName || userName.length === 0) return res.status(400).json({ message: "Invalid username" });

            await userServices.update(userId, userName);

            return res.status(200).json({ message: "Username changed successfully." });
        } catch (err) {
            next(err);
        }
    },

    remove: async (req: AuthReq<{ id: string }, any>, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) return res.status(401).json({ message: "Unauthorized" });

            await userServices.delete(userId);

            return res.status(200).json({ message: "Deleted account successfully!" });
        } catch {

        }
    },
};