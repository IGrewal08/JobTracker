import { redis } from '../config/redis.js';
import type { AuthReq } from '../middleware/auth.js';
import { userServices } from '../services/user.services.js';
import type { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

type Name = {
  newName: string;
};

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 90 * 90 * 100,
};

export const userController = {
  getName: async (
    req: AuthReq<{ id: string; name: string }, any>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized.' });
      const userName = await userServices.getName(userId);
      return res.status(200).json(userName);
    } catch (err) {
      next(err);
    }
  },

  update: async (
    req: AuthReq<{ id: string }, any>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const userName: Name = req.body;
      if (!userName || userName.newName.length === 0)
        return res.status(400).json({ message: 'Invalid username' });

      userServices.update(userId, userName.newName);

      return res
        .status(200)
        .json({ message: 'Username changed successfully.' });
    } catch (err) {
      next(err);
    }
  },

  remove: async (
    req: AuthReq<{ id: string }, any>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized' });

      const token = req.cookies.token;
      if (token) {
        const decoded = jwt.decode(token) as { exp?: number } | null;
        if (decoded?.exp) {
          const secondsUntilExpiry =
            decoded.exp - Math.floor(Date.now() / 1000);
          if (secondsUntilExpiry > 0) {
            await redis.set(`denylist:${token}`, '1', 'EX', secondsUntilExpiry);
          }
        }
      }

      userServices.delete(userId);

      return res
        .clearCookie('token', COOKIE_OPTIONS)
        .status(200)
        .json({ message: 'Account deleted successfully.' });
    } catch (err) {
      next(err);
    }
  },
};
