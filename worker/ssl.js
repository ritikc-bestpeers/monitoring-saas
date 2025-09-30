import dotenv from "dotenv";

dotenv.config();
import { Worker } from "bullmq";
import IORedis from "ioredis";
import tls from "tls";
import { URL } from "url";
import { MongoClient } from "mongodb";

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const client = new MongoClient(process.env.MONGO_URI);
await client.connect();
const db = client.db(process.env.MONGO_DB_NAME);

const trackSSLCollection = db.collection("trackssls");

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

      await trackSSLCollection.updateOne(
        { _id: monitorId },
        {
          $set: {
            validFrom: sslInfo.validFrom,
            validTo: sslInfo.validTo,
            daysRemaining: sslInfo.daysRemaining,
            issuer: sslInfo?.issuer?.O,
            lastCheckedAt: new Date(),
          },
        }
      );
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
