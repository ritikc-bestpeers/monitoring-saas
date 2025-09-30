import "../config/mongodb.js";
import { Worker } from "bullmq";
import TrackSSL from "../models/track_ssl.model.js";
import tls from "tls";
import { URL } from "url";
import { redisConnection } from "../config/redis.js";

const connection = redisConnection;

function getSSLCertificate(hostname, port = 443) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      port,
      hostname,
      { servername: hostname, rejectUnauthorized: false },
      () => {
        const cert = socket.getPeerCertificate();
        socket.end();

        if (!cert || !cert.valid_to) {
          return reject(new Error("No certificate found"));
        }

        resolve({
          validFrom: new Date(cert.valid_from),
          validTo: new Date(cert.valid_to),
          daysRemaining: Math.round(
            (new Date(cert.valid_to) - Date.now()) / (1000 * 60 * 60 * 24)
          ),
          subject: cert.subject,
          issuer: cert.issuer,
        });
      }
    );

    socket.on("error", (err) => reject(err));
  });
}

const worker = new Worker(
  "sslCheck",
  async (job) => {
    //
    console.log(
      "------------------------------------------------------------------------"
    );
    console.log("JOB STARTED");
    const { monitorId, url } = job.data;

    try {
      const urlObj = new URL(url);
      let sslInfo = await getSSLCertificate(urlObj.hostname);

      await TrackSSL.findByIdAndUpdate(monitorId, {
        validFrom: sslInfo.validFrom,
        validTo: sslInfo.validTo,
        daysRemaining: sslInfo.daysRemaining,
        issuer: sslInfo?.issuer?.O,
        lastCheckedAt: new Date(),
      });
    } catch (err) {
      console.log(err);
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
