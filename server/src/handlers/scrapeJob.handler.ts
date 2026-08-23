import type { Job as BullJob } from 'bullmq';
import { prisma } from '../config/prisma.js';
import { jobServices } from '../services/job.services.js';
import { hashJob, isDuplicate, markSeen } from '../services/dedup.services.js';
import { mapRemotiveJob } from '../queues/remotive.js';
import { emitter } from '../config/socketEmitter.js';

type ScrapeJobData = {
  scrapeId: string;
  targetUrl: string;
  options?: string[];
};

function parseOptions(options: string[] = []) {
  const parsed: {
    location?: string;
    remoteOnly?: boolean;
    salaryMin?: number;
    jobTypes?: string[];
  } = {};
  for (const opt of options) {
    const [key, value] = opt.split('=');
    if (key === 'location') parsed.location = value;
    if (key === 'remoteOnly') parsed.remoteOnly = value === 'true';
    if (key === 'salaryMin') parsed.salaryMin = Number(value);
    if (key === 'jobTypes') parsed.jobTypes = value?.split(',');
  }
  return parsed;
}

function matchesFilter(
  mapped: ReturnType<typeof mapRemotiveJob>,
  filter: ReturnType<typeof parseOptions>,
): boolean {
  if (
    filter.location &&
    mapped.location &&
    !mapped.location.toLowerCase().includes(filter.location.toLowerCase())
  ) {
    return false;
  }
  if (
    filter.salaryMin &&
    mapped.salaryMax !== undefined &&
    mapped.salaryMax < filter.salaryMin
  ) {
    return false;
  }
  if (
    filter.jobTypes?.length &&
    mapped.jobType &&
    !filter.jobTypes.includes(mapped.jobType)
  ) {
    return false;
  }
  return true;
}

export async function handleScrapeJob(job: BullJob<ScrapeJobData>) {
  const { scrapeId, targetUrl, options } = job.data;
  const filter = parseOptions(options);

  const res = await fetch(targetUrl);
  if (!res.ok) {
    throw new Error(`Scrape fetch failed (${res.status}) for ${targetUrl}`);
  }

  const body = await res.json();
  const rawJobs = body.jobs ?? [];

  let saved = 0,
    skippedDuplicate = 0,
    skippedFilter = 0;

  for (const raw of rawJobs) {
    const mapped = mapRemotiveJob(raw);
    const hash = hashJob(mapped.title, mapped.company, mapped.url);

    if (await isDuplicate(hash)) {
      skippedDuplicate++;
      continue;
    }

    if (!matchesFilter(mapped, filter)) {
      skippedFilter++;
      continue;
    }

    try {
      const newJob = await jobServices.create({ ...mapped, hash });
      await markSeen(hash);
      saved++;

      emitter.to(scrapeId).emit('new-job', newJob);
    } catch (err) {
      console.error(`Failed to save job "${mapped.title}":`, err);
    }
  }

  await prisma.scrapeFilter.update({
    where: { userId: scrapeId },
    data: { lastScrapedAt: new Date() },
  });

  return {
    totalFetched: rawJobs.length,
    saved,
    skippedDuplicate,
    skippedFilter,
  };
}
