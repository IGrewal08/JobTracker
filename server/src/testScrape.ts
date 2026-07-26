import { PrismaClient } from '@prisma/client';
import { mapRemotiveJob } from './queues/remotive.js';
import { hashJob, isDuplicate, markSeen } from './services/dedup.services.js';
import { jobServices } from './services/job.services.js';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function run() {
  const url = 'https://remotive.com/api/remote-jobs?search=react&limit=10';
  console.log(`Fetching: ${url}`);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

  const { jobs: rawJobs } = await res.json();
  console.log(`Fetch ${rawJobs.length} listings`);

  let saved = 0,
    skipped = 0;

  for (const raw of rawJobs) {
    const mapped = mapRemotiveJob(raw);
    const hash = hashJob(mapped.title, mapped.company, mapped.url);

    if (await isDuplicate(hash)) {
      console.log(`SKIP (duplicate): ${mapped.title}`);
      skipped++;
      continue;
    }

    try {
      await jobServices.create({ ...mapped, hash });
      await markSeen(hash);
      console.log(`SAVED: ${mapped.title} @ ${mapped.company}`);
      saved++;
    } catch (err: any) {
      console.error(`FAILED: ${mapped.title} - ${err.message}`);
    }
  }

  console.log(`\nDone - saved: ${saved}, skipped: ${skipped}`);
  await prisma.$disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
