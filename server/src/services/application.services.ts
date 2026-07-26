import { ApplicationStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';

export function parseStatus(value: unknown): ApplicationStatus | undefined {
  if (typeof value != 'string') return undefined;
  const upper = value.toUpperCase();
  if (upper in ApplicationStatus) return upper as ApplicationStatus;
  return undefined;
}

type ApplicationWriteDate = {
  status?: ApplicationStatus;
  appliedAt?: Date;
  interviewAt?: Date;
  offerAmount?: number;
  notes?: string;
  coverLetter?: string;
};

export const applicationService = {
  getById: async (id: string) => {
    return prisma.application.findUnique({
      where: {
        id,
      },
      include: {
        job: true,
      },
    });
  },

  list: async (
    userId: string,
    filters: {
      status?: ApplicationStatus;
      company?: string;
      location?: string;
      remote?: boolean;
      tags?: string[];
      createdAt?: Prisma.SortOrder;
      updatedAt?: Prisma.SortOrder;
    },
  ) => {
    return prisma.application.findMany({
      where: {
        userId,
        ...(filters.status && { status: filters.status }),
        job: {
          ...(filters.company && { company: filters.company }),
          ...(filters.location && { location: filters.location }),
          ...(filters.remote !== undefined && { remote: filters.remote }),
          ...(filters.tags &&
            filters.tags.length > 0 && { tags: { hasSome: filters.tags } }),
        },
      },
      include: {
        job: true,
      },
      orderBy: [
        ...(filters.createdAt ? [{ createdAt: filters.createdAt }] : []),
        ...(filters.updatedAt ? [{ updatedAt: filters.updatedAt }] : []),
      ],
    });
  },

  create: async (userId: string, jobId: number, data: ApplicationWriteDate) => {
    return await prisma.application.create({
      data: {
        userId,
        jobId,
        ...data,
      },
      include: {
        job: true,
      },
    });
  },

  update: async (
    id: string,
    userId: string,
    data: Partial<ApplicationWriteDate>,
  ) => {
    return prisma.application.update({
      where: {
        id,
        userId,
      },
      data,
      include: {
        job: true,
      },
    });
  },

  remove: async (id: string, userId: string) => {
    return prisma.application.delete({
      where: {
        id,
        userId,
      },
    });
  },
};
