import crypto from "crypto";
import { redis } from "../config/redis.js";

const DEDUP_TTL_SECONDS = 60 * 60 * 24 * 30;

export function hashJob(title: string, company: string, url: string): string {
    return crypto.createHash("sha256").update(`${title}${company}${url}`).digest("hex");
}

export async function isDuplicate(hash: string): Promise<boolean> {
    const exists = await redis.exists(`jobhash:${hash}`);
    return exists === 1;
}

export async function markSeen(hash: string): Promise<void> {
    await redis.set(`jobhash:${hash}`, "1", "EX", DEDUP_TTL_SECONDS);
}