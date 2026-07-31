import { handleDailyTrigger } from '../handlers/dailyTrigger.handler.js';
import { handleScrapeJob } from '../handlers/scrapeJob.handler.js';
import { Worker, type Job } from 'bullmq';

const worker = new Worker(
  'jobqueue',
  async (job: Job) => {
    switch (job.name) {
      case 'daily-trigger':
        return handleDailyTrigger(job);
      case 'scrape-job':
        return handleScrapeJob(job);
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  },
  {
    connection: { host: process.env.HOST, port: 6379 },
    concurrency: 3,
  },
);

worker.on('completed', (job) =>
  console.log(`${job.name} (${job.id}) completed.`),
);
worker.on('failed', (job, err) =>
  console.error(`${job?.name} (${job?.id}) failed:`, err.message),
);
