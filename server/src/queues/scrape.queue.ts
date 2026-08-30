import { Queue } from 'bullmq';

const jobQueue = new Queue('jobqueue', {
  connection: {
    host: process.env.HOST,
    port: 6379,
  },
});

export async function initQueue() {
  await jobQueue.upsertJobScheduler(
    'daily-trigger',
    {
      pattern: '0 0 0 * * *',
    },
    {
      name: 'daily-trigger',
      data: {},
    },
  );
  await jobQueue.setGlobalConcurrency(4);
}

export async function sendScrapeRequest(
  scrapeId: string,
  targetUrl: string,
  options?: string[],
) {
  await jobQueue.add(
    'scrape-job',
    { scrapeId, targetUrl, options },
    {
      attempts: 5,
      delay: 5000,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnFail: { age: 3600, count: 1000 },
      removeOnComplete: { age: 3600, count: 1000 },
    },
  );
}

export const manageQueue = {
  getGlobalConcurrency() {
    return jobQueue.getGlobalConcurrency();
  },
  async setGlobalConcurrency(value: number) {
    await jobQueue.setGlobalConcurrency(value);
  },
  async removeAllJobs() {
    await jobQueue.obliterate();
  },
  async setGlobalLimit(maxJobs: number, duration: number) {
    await jobQueue.setGlobalRateLimit(maxJobs, duration);
  },
};
