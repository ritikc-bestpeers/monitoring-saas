import globalErrorHandler from "../middlewares/globalErrorHandler.js";
import MonitoringResult from "../models/monitoring_results.model.js";

const getMonitoringResults = async (req, res, next) => {
  try {
    let results = await MonitoringResult.find().lean();
    res.status(200).json({
      success: true,
      message: "Monitoring results fetched!",
      data: { results },
    });
  } catch (error) {
    globalErrorHandler(error, req, res, next)
  }
};


const getMonitoringResultsForMonitor = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      MonitoringResult.find({ monitorId: req.params.monitorId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      MonitoringResult.countDocuments({ monitorId: req.params.monitorId })
    ]);
    res.status(200).json({
      success: true,
      message: "Monitoring results fetched!",
      data: {
        results,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1
        }
      },
    });
  } catch (error) {
    globalErrorHandler(error, req, res, next)
  }
};

export default { getMonitoringResults, getMonitoringResultsForMonitor };
