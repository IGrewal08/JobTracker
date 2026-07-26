import { JobType, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';

export function parseType(value: unknown): JobType | undefined {
  if (typeof value != 'string') return undefined;
  const upper = value.toUpperCase();
  if (upper in JobType) return upper as JobType;
  return undefined;
}

type JobWriteData = {
  title: string;
  company: string;
  description: string;
  url: string;
  source: string;
  hash: string;
  tags: string[];
  remote: boolean;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType?: JobType;
  postedAt?: Date;
  expiresAt?: Date;
};

export const jobServices = {
  getById: async (id: number) => {
    return prisma.job.findUnique({
      where: {
        id,
      },
    });
  },

  list: async (filters: {
    search?: string;
    companies?: string[];
    locations?: string[];
    jobTypes?: JobType[];
    tags?: string[];
    remote?: boolean;
    salaryMin?: number;
    salaryMax?: number;
    postedWithin?: number;
    sort?: string;
  }) => {
    const ORDER_MAP: Record<string, Prisma.JobOrderByWithRelationInput> = {
      newest: { createdAt: Prisma.SortOrder.desc },
      oldest: { createdAt: Prisma.SortOrder.asc },
      salaryDesc: { salaryMax: Prisma.SortOrder.desc },
      salaryAsc: { salaryMin: Prisma.SortOrder.asc },
    };

    const orderBy = ORDER_MAP[filters.sort ?? 'newest'] ?? ORDER_MAP.newest;

    const postedAfter = filters.postedWithin
      ? new Date(Date.now() - filters.postedWithin * 86400000)
      : undefined;

    return prisma.job.findMany({
      where: {
        ...(filters.search && {
          OR: [
            { title: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
          ],
        }),
        ...(filters.companies?.length && {
          company: { in: filters.companies },
        }),
        ...(filters.locations?.length && {
          location: { in: filters.locations },
        }),
        ...(filters.jobTypes?.length && { jobType: { in: filters.jobTypes } }),
        ...(filters.tags?.length && { tags: { hasSome: filters.tags } }),
        ...(filters.remote !== undefined && { remote: filters.remote }),
        ...(filters.salaryMin && { salaryMin: { gte: filters.salaryMin } }),
        ...(filters.salaryMax && { salaryMax: { lte: filters.salaryMax } }),
        ...(postedAfter && { postedAt: { gte: postedAfter } }),
      },
      ...(orderBy && { orderBy }),
    });
  },

  create: async (data: JobWriteData) => {
    return await prisma.job.create({
      data,
    });
  },

  update: async (id: number, data: Partial<JobWriteData>) => {
    return prisma.job.update({
      where: {
        id,
      },
      data,
    });
  },

  delete: async (id: number) => {
    return prisma.job.delete({
      where: {
        id,
      },
    });
  },
};
