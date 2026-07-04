import { Redis } from "ioredis";
import { Emitter } from "@socket.io/redis-emitter";

// custom emits
const emitterClient = new Redis({ host: process.env.HOST, port: 6379 });
export const emitter = new Emitter(emitterClient);