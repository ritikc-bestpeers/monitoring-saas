import express from "express";
import monitoringResultsController from "../controller/monitoring_results.controller.js";

const monitoringResultsRoutes = express.Router();

monitoringResultsRoutes.get("/", monitoringResultsController.getMonitoringResults);

monitoringResultsRoutes.get("/:monitorId", monitoringResultsController.getMonitoringResultsForMonitor);

export default monitoringResultsRoutes;