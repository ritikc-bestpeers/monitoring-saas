import TrackSSL from "../models/track_ssl.model.js";
import globalErrorHandler from "../middlewares/globalErrorHandler.js";
import { monitorQueue, sslQueue } from "../config/queue.js";

export async function addSSLCheckJob({ trackSslId, url }) {
  let job = await sslQueue.add(
    trackSslId,
    { trackSslId, url },
    { repeat: { cron: "0 0 * * *" } } // every midnight
  );

  // Save remote job key
  await TrackSSL.findByIdAndUpdate(trackSslId, {
    repeatJobKey: job.repeatJobKey,
  });

  console.log("job monitor id: ", trackSslId);
  console.log(`✅ Monitoring job added for ${url}: `, job);
}

const startMonitoring = async (req, res, next) => {
  try {
    // const data = validate(monitoringValidations.createMonitor, req.body);

    let id = Date.now().toString();

    let trackSSL = await TrackSSL.create({
      userId: req.user.id,
      domain: req.body.domain
    });

    await addSSLCheckJob({
      trackSslId: trackSSL._id.toString(),
      url: trackSSL.domain,
    });

    res.status(200).json({
      success: true,
      message: "Monitoring started",
      data: { id, trackSSL },
    });
  } catch (error) {
    globalErrorHandler(error, req, res, next);
  }
};

const stopMonitoring = async (req, res, next) => {
  try {
    const id = req.params.monitor_id;
    if (!id) {
      return res.status(400).json({
        message: "Id is required!",
      });
    }

    stop(id);

    res.status(200).json({
      success: true,
      message: "Monitoring stopped",
      data: { id },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong!",
    });
  }
};

const getSSLDomains = async (req, res, next) => {
  try {
    let monitors = await TrackSSL.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({
      success: true,
      message: "Monitoring fetched!",
      data: { monitors },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong!",
    });
  }
};

const deleteMonitoring = async (req, res, next) => {
  try {
    const monitor = await TrackSSL.findById(req.params.monitorId);

    if (!monitor) {
      return res.status(404).json({
        success: false,
        message: "Monitor not found",
      });
    }

    if (monitor.repeatJobKey) {
      await monitorQueue.removeJobScheduler(monitor.repeatJobKey);
    }

    await TrackSSL.findByIdAndDelete(req.params.monitorId);

    res.status(200).json({
      success: true,
      message: "Monitoring deleted!",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong!",
    });
  }
};

const changeMonitoringStatus = async (req, res, next) => {
  try {
    let monitor = await TrackSSL.findById(req.params.monitorId);

    if (!monitor) {
      return res.status(404).json({
        success: false,
        message: "Monitor not found",
      });
    }

    if (req.params.status === "pause") {
      await monitorQueue.removeJobScheduler(monitor.repeatJobKey);
      monitor.status = "paused"; // update DB status
      monitor.repeatJobKey = null;
    }

    if (req.params.status === "start") {
      await addMonitorJob({
        monitorId: monitor._id.toString(),
        url: monitor.url,
        frequencySec: monitor.frequencySec,
      });

      monitor.status = "active";
    }

    await monitor.save();

    res.status(200).json({
      success: true,
      message: "Monitoring status updated!",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong!",
    });
  }
};

export default {
  startMonitoring,
  stopMonitoring,
  getSSLDomains,
  deleteMonitoring,
  changeMonitoringStatus,
};
