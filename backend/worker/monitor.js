import "../config/mongodb.js";
import { Worker } from "bullmq";
import axios from "axios";
import MonitoringResult from "../models/monitoring_results.model.js";
import Monitoring from "../models/monitoring.model.js";
import { redisConnection } from "../config/redis.js";
import { logger } from "../config/logger.js";

const connection = redisConnection;

const worker = new Worker(
  "monitoring",
  async (job) => {
    //
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("JOB STARTED");
    const { monitorId, url } = job.data;

    try {
      const start = Date.now();
      const res = await axios.get(url, { timeout: 30000 });
      const time = Date.now() - start;

      await MonitoringResult.create({
        monitorId,
        status: "up",
        responseTime: time,
        statusCode: res.status,
      });

      await Monitoring.findByIdAndUpdate(monitorId, {
        siteStatus: "up",
        lastCheckedAt: new Date(),
      });

      logger.info(
        {
          event: "monitor.check.success",
          monitorId,
          url,
          responseTime: time,
          statusCode: res.status,
          attempts: job.attemptsMade + 1,
        },
        `Monitor UP: ${url}`
      );
    } catch (err) {
      await MonitoringResult.create({
        monitorId,
        status: "down",
        responseTime: null,
        error: err.code || err.message,
      });

      logger.warn(
        {
          event: "monitor.check.failure",
          monitorId,
          url,
          error: err.code || err.message,
          attempts: `${job.attemptsMade + 1}/${job.opts.attempts}`,
        },
        `Monitor DOWN: ${url}`
      );

      if (job.attemptsMade + 1 >= job.opts.attempts) {
        await Monitoring.findByIdAndUpdate(monitorId, {
          siteStatus: "down",
          lastCheckedAt: new Date(),
        });
        logger.error({
          event: "monitor.marked.down",
          monitorId,
          url,
        }, `Marked DOWN after retries: ${url}`);
      }

      throw err;
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
  console.log(
    "----------------------------------------------------------------------"
  );
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});
