import { Redis } from 'ioredis';

export const redis = new Redis({
    host: process.env.HOST as string,
    port: 6379,
});

redis.on("error", (error) => {
    console.error("[Redis Error]", error);
});
