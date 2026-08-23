import type { NextFunction, Response } from 'express';
import {
  applicationService,
  parseStatus,
} from '../services/application.services.js';
import type { AuthReq } from '../middleware/auth.js';

export const applicationController = {
  getById: async (
    req: AuthReq<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.params.id;
      if (!id) return res.status(201).json({ message: '' });
      const application = await applicationService.getById(id);
      if (!application)
        return res.status(404).json({ message: 'Application not found.' });
      return res.status(200).json(application);
    } catch (err) {
      next(err);
    }
  },

  list: async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized.' });

      const rawTags = req.query.tags;
      const tags: string[] = Array.isArray(rawTags)
        ? (rawTags as string[])
        : typeof rawTags === 'string'
          ? rawTags.split(',')
          : [];

      const { status, company, location, updatedAt, createdAt } = req.query;

      const remote =
        req.query.remote === 'true'
          ? true
          : req.query.remote === 'false'
            ? false
            : undefined;

      const rawUpdateData = {
        status: status ? parseStatus(req.query.status) : undefined,
        company: typeof company === 'string' ? company : undefined,
        location: typeof location === 'string' ? location : undefined,
        remote,
        tags,
        createdAt:
          createdAt === 'asc' || createdAt === 'desc' ? createdAt : undefined,
        updatedAt:
          updatedAt === 'asc' || updatedAt === 'desc' ? updatedAt : undefined,
      };

      const cleanUpdateData = Object.fromEntries(
        Object.entries(rawUpdateData).filter(
          ([_, value]) => value !== undefined,
        ),
      );

      const applications = await applicationService.list(
        userId,
        cleanUpdateData,
      );
      return res.status(200).json(applications);
    } catch (err) {
      next(err);
    }
  },

  create: async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized.' });

      const { status, jobId, appliedAt, interviewAt, offerAmount } = req.body;
      if (!jobId)
        return res.status(400).json({ message: 'jobId is required.' });

      const rawCreateData = {
        status: status ? parseStatus(status) : undefined,
        appliedAt: appliedAt ? new Date(appliedAt) : undefined,
        interviewAt: interviewAt ? new Date(interviewAt) : undefined,
        offerAmount: offerAmount ? Number(offerAmount) : undefined,
        notes: req.body.notes,
        coverLetter: req.body.coverLetter,
      };

      const cleanCreateData = Object.fromEntries(
        Object.entries(rawCreateData).filter(
          ([_, value]) => value !== undefined,
        ),
      );

      const application = await applicationService.create(
        userId,
        Number(jobId),
        cleanCreateData,
      );

      return res.status(200).json(application);
    } catch (err) {
      next(err);
    }
  },

  update: async (
    req: AuthReq<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized.' });

      const { status, appliedAt, interviewAt, offerAmount } = req.body;

      const rawUpdateData = {
        status: status ? parseStatus(req.body.status) : undefined,
        appliedAt: appliedAt ? new Date(appliedAt) : undefined,
        interviewAt: interviewAt ? new Date(interviewAt) : undefined,
        offerAmount: offerAmount ? Number(offerAmount) : undefined,
        notes: req.body.notes,
        coverLetter: req.body.coverLetter,
      };

      const cleanUpdateData = Object.fromEntries(
        Object.entries(rawUpdateData).filter(
          ([_, value]) => value !== undefined,
        ),
      );

      const application = await applicationService.update(
        req.params.id,
        userId,
        cleanUpdateData,
      );

      return res.status(200).json(application);
    } catch (err) {
      next(err);
    }
  },

  remove: async (
    req: AuthReq<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;
      const id = req.params.id;
      if (!userId) return res.status(401).json({ message: 'Unauthorized.' });
      await applicationService.remove(id, userId);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
