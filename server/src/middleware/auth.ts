import { redis } from "@/config/redis.js";
import type { Request, NextFunction, Response } from "express";
import type * as core from "express-serve-static-core";
import jwt from "jsonwebtoken";

export interface AuthReq<
    P = core.ParamsDictionary, 
    ResBody = any,
    ReqBody = any,
    ReqQuery = core.Query
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: {
    id: string;
    name: string;
    role: string;
  };
}

export async function verifyToken(req: AuthReq, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied: No token provided." });
  }

  const isDenyListed = await redis.exists(`denylist:${token}`);
  if (isDenyListed) {
    return res.status(401).json({ message: "Token has been invalidated." });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, { algorithms: ["HS256"] }, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token." });
    req.user = decoded as AuthReq["user"];
    next();
  });
}