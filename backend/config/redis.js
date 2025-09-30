import IORedis from "ioredis";
import { CONFIG } from "./config.js";

export const redisConnection = new IORedis(CONFIG.REDIS_URL, {
  maxRetriesPerRequest: null,
});
