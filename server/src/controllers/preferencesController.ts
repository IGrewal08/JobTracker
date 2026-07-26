import { prisma } from '../config/prisma.js';
import type { AuthReq } from '../middleware/auth.js';
import type { NextFunction, Response } from 'express';

export const preferencesController = {
  get: async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
      const filter = await prisma.scrapeFilter.findUnique({
        where: { userId: req.user!.id },
      });
      return res.status(200).json(filter);
    } catch (err) {
      next(err);
    }
  },

  upsert: async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
      const { keywords, remoteOnly, salaryMin, jobTypes } = req.body;
      const filter = await prisma.scrapeFilter.upsert({
        where: { userId: req.user!.id },
        create: {
          userId: req.user!.id,
          keywords,
          remoteOnly,
          salaryMin,
          jobTypes,
        },
        update: { keywords, remoteOnly, salaryMin, jobTypes },
      });
      return res.status(200).json(filter);
    } catch (err) {
      next(err);
    }
  },
};
