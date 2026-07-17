import { prisma } from "../config/prisma.js";
import { sendScrapeRequest } from "@/queues/scrape.queue.js";
import type { Job } from "bullmq";

const REMOTIVE_BASE_URL = "https://remotive.com/api/remote-jobs";

export async function handleDailyTrigger(job: Job) {
    const filters = await prisma.scrapeFilter.findMany();

    console.log(`[daily-trigger] Found ${filters.length} scrape filters to process`);

    let enqueued = 0;
    for (const filter of filters) {
        try {
            const targetUrl = buildRemotiveURL(filter);
            const options = buildPostFetchOptions(filter);

            await sendScrapeRequest(filter.userId, targetUrl, options);
            enqueued++;
        } catch (err) {
            console.error(`[daily-trigger] Failed to enqueue scrape for user ${filter.userId}:`, err);
        }
    }

    return { totalFilters: filters.length, enqueued }
}

function buildRemotiveURL(filters: { keywords: string[] }): string {
    const params = new URLSearchParams();

    if (filters.keywords.length > 0) {
        params.set("search", filters.keywords.join(" "));
    }
    params.set("limit", "50");

    return `${REMOTIVE_BASE_URL}?${params.toString()}`;
}

function buildPostFetchOptions(filter: {
    location: string | null;
    remoteOnly: boolean;
    salaryMin: number | null;
    jobTypes: string[]
}): string[] {
    const options: string[] = [];

    if (filter.location) options.push(`location=${filter.location}`);
    if (filter.remoteOnly) options.push(`remoteOnly=true`);
    if (filter.salaryMin) options.push(`salaryMin=${filter.salaryMin}`);
    if (filter.jobTypes.length) options.push(`jobTypes=${filter.jobTypes.join(",")}`);

    return options;
}