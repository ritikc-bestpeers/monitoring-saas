import Monitoring from "../models/monitoring.model.js";
import monitoringValidations from "../validations/monitoring.validations.js";
import validate from "../utils/validate.js";
import globalErrorHandler from "../middlewares/globalErrorHandler.js";
import MonitoringResult from "../models/monitoring_results.model.js";
import { monitorQueue } from "../config/queue.js";

export async function addMonitorJob({ monitorId, url, frequencySec }) {
  let job = await monitorQueue.add(
    monitorId,
    { monitorId, url },
    {
      repeat: { every: frequencySec * 1000 }, // 🔁 runs at interval
      attempts: 5, // retry up to 5 times if failed
      backoff: { type: "fixed", delay: 5000 }, // 5 sec retry delay
      removeOnComplete: true,
      removeOnFail: false,
    }
  );

  // Save remote job key
  await Monitoring.findByIdAndUpdate(monitorId, {
    repeatJobKey: job.repeatJobKey,
  });

  console.log("job monitor id: ", monitorId);
  console.log(`✅ Monitoring job added for ${url}: `, job);
}

const startMonitoring = async (req, res, next) => {
  try {
    const data = validate(monitoringValidations.createMonitor, req.body);

    let id = Date.now().toString();

    let monitor = await Monitoring.create({
      userId: req.user.id,
      name: data.name,
      url: data.url,
      frequencySec: data.frequencySec,
    });

    // start({
    //   website: monitor.url,
    //   id,
    //   frequencySec: monitor.frequencySec,
    //   monitoringId: monitor._id.toString(),
    // });

    await addMonitorJob({
      monitorId: monitor._id.toString(),
      url: monitor.url,
      frequencySec: monitor.frequencySec,
    });

    res.status(200).json({
      success: true,
      message: "Monitoring started",
      data: { id, monitor },
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

const getMonitoring = async (req, res, next) => {
  try {
    let monitors = await Monitoring.find().sort({ createdAt: -1 }).lean();
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
    const monitor = await Monitoring.findById(req.params.monitorId);

    if (!monitor) {
      return res.status(404).json({
        success: false,
        message: "Monitor not found",
      });
    }

    if (monitor.repeatJobKey) {
      await monitorQueue.removeJobScheduler(monitor.repeatJobKey);
    }

    await Monitoring.findByIdAndDelete(req.params.monitorId);
    await MonitoringResult.deleteMany({ monitorId: req.params.monitorId });

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
    let monitor = await Monitoring.findById(req.params.monitorId);

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
  getMonitoring,
  deleteMonitoring,
  changeMonitoringStatus,
};
