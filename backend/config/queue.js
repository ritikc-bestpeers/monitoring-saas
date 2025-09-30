import { Queue } from "bullmq";
import { redisConnection } from "./redis.js";

const connection = redisConnection;

// 🔎 Log connection events
connection.on("connect", () => {
  console.log("Redis connected");
});

connection.on("ready", () => {
  console.log("Redis connection is ready to use");
});

connection.on("error", (err) => {
  console.error("Redis connection error:", err);
});

connection.on("close", () => {
  console.warn("Redis connection closed");
});

export const monitorQueue = new Queue("monitoring", { connection });

export const sslQueue = new Queue("sslCheck", { connection });