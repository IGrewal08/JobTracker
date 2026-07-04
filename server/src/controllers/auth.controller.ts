import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import { getUser } from "../services/auth.services.js";
import { prisma } from "../config/prisma.js";
import type { AuthReq } from "../middleware/auth.js";

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'strict' as const,
    maxAge: 90 * 90 * 100,
};

export const authController = {

    loginController: async (req: AuthReq<{ id: string }, any>, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(401).json({ message: "Invalid Email or Password." });
            }

            const user = await getUser(email);
            if (!user) {
                return res.status(401).json({ message: "Authentication failed" });
            }

            const match: boolean = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).json({ message: "Invalid Email or Password." });
            }


            const token = jwt.sign(
                {
                    id: user.id,
                    name: user.name,
                    role: user.role,
                },
                    process.env.JWT_SECRET as string,
                {
                    expiresIn: '1h'
                }
            );

            res.cookie('token', token, COOKIE_OPTIONS).status(200).json({ message: "Login successful." });
        } catch (err) {
            next(err);
        }
    },

    signUpController: async (req: AuthReq<{ id: string }, any>, res: Response, next: NextFunction) => {
        try {
            const { email, name, password } = req.body;
            if (!email || !password) return res.status(400).json({ message: "Email or Password required for login." });

            const existing = await getUser(email);

            if (existing) {
                return res.status(409).json({ message: "Email already in use." });
            }

            const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    ...(name && { name }),
                },
            });

            const token = jwt.sign(
                { id: newUser.id, name: newUser.name, role: newUser.role },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h'},
            );

            return res.cookie('token', token, COOKIE_OPTIONS).status(201).json({ message: "User registered successfully." });
        } catch (err) {
            next(err);
        }
    },

    logoutController: async (req: AuthReq<{ id: string }>, res: Response, next: NextFunction) => {
        try {
            // Implement for Redis
            return res.clearCookie("token", COOKIE_OPTIONS)
                .status(200).json({ message: "Logged out successfully." });
        } catch (err) {
            next(err);
        }
    }
}
